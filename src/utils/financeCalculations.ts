import { Balance, Transaction } from '../types';

export function financeCalculations(transactions: Transaction[]): Balance {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      acc.balance = acc.income - acc.expense;

      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
}

// 日付ごとの収支を計算する関数
// 引数として Transaction[] (取引データの配列) を受け取り、
// 戻り値として Record<string, Balance> (日付をキーとする収支データのオブジェクト) を返す
export function calculateDailyBalances(
  transactions: Transaction[]
): Record<string, Balance> {
  // transactions.reduce を使用して配列を一つのオブジェクトにまとめる
  // reduce は配列の要素を一つずつ処理して、最終的に一つの値にまとめるメソッド
  // <Record<string, Balance>> は TypeScript の型指定で、
  // キーが string (日付)、値が Balance 型のオブジェクトであることを示す
  return transactions.reduce<Record<string, Balance>>((acc, transaction) => {
    // acc: アキュムレータ。前回のループでの結果が入っている
    // transaction: 現在処理している取引データ

    // 取引の日付を取得
    const day = transaction.date;

    // その日のデータが未作成の場合、初期値を設定
    if (!acc[day]) {
      acc[day] = {
        income: 0, // その日の収入合計
        expense: 0, // その日の支出合計
        balance: 0, // その日の収支バランス
      };
    }

    // 取引タイプが "income" (収入) の場合
    if (transaction.type === 'income') {
      // 収入金額を加算
      acc[day].income += transaction.amount;
    } else {
      // 支出金額を加算
      acc[day].expense += transaction.amount;
    }

    // その日の収支バランスを計算 (収入 - 支出)
    acc[day].balance = acc[day].income - acc[day].expense;

    // 処理結果のオブジェクトを返す
    // 次のループでこの値が acc として渡される
    return acc;
  }, {}); // {} は reduce の初期値（空のオブジェクト）
}
