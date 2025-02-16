import { z } from 'zod';

const expenseCategories = ['食費', '日用品', '住居費', '交際費', '娯楽', '交通費'] as const;
const incomeCategories = ['給与', '副収入', 'お小遣い'] as const;

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, { message: '日付は必須です' }),
  amount: z.number().min(1, { message: '金額は1円以上にしてください' }),
  content: z
    .string()
    .min(1, { message: '内容を入力してください' })
    .max(50, { message: '内容は50文字以内にしてください' }),
  category: z
    .union([
      z.enum(expenseCategories),
      z.enum(incomeCategories),
      z.literal(''),
    ])
}).refine((data) => {
  // 空文字の場合はバリデーションエラー
  if (data.category === '') {
    return false;
  }
  
  // 支出の場合は支出カテゴリーから選択されている必要がある
  if (data.type === 'expense') {
    return expenseCategories.includes(data.category as typeof expenseCategories[number]);
  }
  
  // 収入の場合は収入カテゴリーから選択されている必要がある
  if (data.type === 'income') {
    return incomeCategories.includes(data.category as typeof incomeCategories[number]);
  }
  
  return false;
}, {
  message: 'カテゴリを正しく選択してください',
  path: ['category'], // エラーをcategoryフィールドに関連付ける
});

export type Schema = z.infer<typeof transactionSchema>;