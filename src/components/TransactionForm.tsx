import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { JSX, useEffect, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close'; // 閉じるボタン用のアイコン
import FastfoodIcon from '@mui/icons-material/Fastfood'; //食事アイコン
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ExpenseCategory, IncomeCategory } from '../types';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddHomeIcon from '@mui/icons-material/AddHome';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import TrainIcon from '@mui/icons-material/Train';
import WorkIcon from '@mui/icons-material/Work';
import SavingsIcon from '@mui/icons-material/Savings';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schema, transactionSchema } from '../validations/schema';
import { Transaction } from '../types';
import { useAppContext } from '../context/AppContext';
interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  // onSaveTransaction: (transaction: Schema) => Promise<void>;
  selectedTransaction: Transaction | null;
  // onDeleteTransaction: (
  //   transactionId: string | readonly string[]
  // ) => Promise<void>;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  // onUpdateTransaction: (
  //   transaction: Schema,
  //   transactionId: string
  // ) => Promise<void>;
  // isMobile: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
type IncomeExpense = 'income' | 'expense';

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element;
}
const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  // onSaveTransaction,
  selectedTransaction,
  // onDeleteTransaction,
  setSelectedTransaction,
  // onUpdateTransaction,
  // isMobile,
  isDialogOpen,
  setIsDialogOpen,
}: TransactionFormProps) => {
  const {
    isMobile,
    onSaveTransaction,
    onDeleteTransaction,
    onUpdateTransaction,
  } = useAppContext();
  const formWidth = 320;

  //支出用カテゴリ
  const expenseCategories: CategoryItem[] = useMemo(
    () => [
      { label: '食費', icon: <FastfoodIcon fontSize="small" /> },
      { label: '日用品', icon: <AlarmIcon fontSize="small" /> },
      { label: '住居費', icon: <AddHomeIcon fontSize="small" /> },
      { label: '交際費', icon: <Diversity3Icon fontSize="small" /> },
      { label: '娯楽', icon: <SportsTennisIcon fontSize="small" /> },
      { label: '交通費', icon: <TrainIcon fontSize="small" /> },
    ],
    []
  );
  // 収入用カテゴリ
  const incomeCategories: CategoryItem[] = useMemo(
    () => [
      { label: '給与', icon: <WorkIcon fontSize="small" /> },
      { label: '副収入', icon: <AddBusinessIcon fontSize="small" /> },
      { label: 'お小遣い', icon: <SavingsIcon fontSize="small" /> },
    ],
    []
  );
  const [categories, setCategories] = useState(expenseCategories);
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '',
      content: '',
    },
    resolver: zodResolver(transactionSchema),
  });
  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue('type', type);
    setValue('category', '');
  };
  //収支のtype(income, expense)を監視
  const currentType = watch('type');

  useEffect(() => {
    const newCategories =
      currentType === 'expense' ? expenseCategories : incomeCategories;
    setCategories(newCategories);
  }, [currentType, expenseCategories, incomeCategories]);
  //送信処理
  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          setSelectedTransaction(null);
          if (isMobile) {
            setIsDialogOpen(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      //取引を新規追加する関数を呼び出している
      onSaveTransaction(data);
    }
    console.log(data);

    reset({
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '',
      content: '',
    });
  };

  // useEffect(() => {
  //   if (selectedTransaction) {
  //     //選択肢が更新されたか確認
  //     const categoryExists = categories.some(
  //       (category) => category.label === selectedTransaction.category
  //     );
  //     setValue('category', categoryExists ? selectedTransaction.category : '');
  //   }
  // }, [selectedTransaction, categories]);

  // useEffectは、コンポーネントの特定の値が変更された時に実行される副作用を定義するHookです
  // この場合、[selectedTransaction, categories]が変更される度に実行されます
  useEffect(() => {
    // selectedTransactionが存在する場合（つまり、取引が選択されている場合）に処理を実行
    if (selectedTransaction) {
      // categories配列の中に、選択された取引のカテゴリが存在するかチェック
      // some()は配列の要素を順番にチェックし、条件に一致する要素が1つでもあればtrueを返す
      const categoryExists = categories.some(
        // category.labelが選択された取引のカテゴリと一致するかをチェック
        // 例: 選択取引のカテゴリが「食費」で、categoriesに「食費」が含まれているか
        (category) => category.label === selectedTransaction.category
      );

      // フォームのカテゴリ値を設定
      // 三項演算子を使用: 条件 ? trueの場合の値 : falseの場合の値
      // categoryExistsがtrue → 選択された取引のカテゴリをセット
      // categoryExistsがfalse → 空文字をセット
      setValue('category', categoryExists ? selectedTransaction.category : '');
    }
  }, [selectedTransaction, categories, setValue]); // この配列内の値が変更されると、useEffect内の処理が実行される

  /* 具体例:
1. 収入カテゴリ表示中に支出の取引（食費）を選択した場合:
   - categoriesには収入カテゴリしかない
   - categoryExistsはfalseになる（食費が見つからない）
   - カテゴリ欄は空白になる

2. 支出カテゴリ表示中に支出の取引（食費）を選択した場合:
   - categoriesには支出カテゴリがある
   - categoryExistsはtrue（食費が見つかる）
   - カテゴリ欄に「食費」がセットされる
*/
  //フォーム内容更新
  useEffect(() => {
    if (selectedTransaction) {
      setValue('type', selectedTransaction.type);
      setValue('date', selectedTransaction.date);
      setValue('amount', selectedTransaction.amount);
      setValue('content', selectedTransaction.content);
    } else {
      reset({
        type: 'expense',
        date: currentDay,
        amount: 0,
        category: '',
        content: '',
      });
    }
  }, [currentDay, reset, selectedTransaction, setValue]);

  useEffect(() => {
    setValue('date', currentDay);
  }, [currentDay, setValue]);

  //削除処理
  const handleDelete = () => {
    //selectedTransaction.idは取引のIDを送る
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      //取引の選択が解除される
      if (isMobile) {
        setIsDialogOpen(false);
      }
      setSelectedTransaction(null);
    }
  };
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={'flex'} justifyContent={'space-between'} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <ButtonGroup fullWidth>
                <Button
                  variant={field.value === 'expense' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => incomeExpenseToggle('expense')}
                >
                  支出
                </Button>
                <Button
                  color={'primary'}
                  variant={field.value === 'income' ? 'contained' : 'outlined'}
                  onClick={() => incomeExpenseToggle('income')}
                >
                  収入
                </Button>
              </ButtonGroup>
            )}
          />
          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              // <TextField
              //   {...field}
              //   error={!!errors.category}
              //   helperText={errors.category?.message}
              //   id="カテゴリ"
              //   label="カテゴリ"
              //   select
              // >
              //   {categories.map((category, index) => (
              //     <MenuItem value={category.label} key={index}>
              //       <ListItemIcon>{category.icon}</ListItemIcon>
              //       {category.label}
              //     </MenuItem>
              //   ))}
              // </TextField>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-select-label">カテゴリ</InputLabel>
                <Select
                  {...field}
                  labelId="category-select-label"
                  id="category-select"
                  label="収支の種類"
                >
                  //{' '}
                  {categories.map((category, index) => (
                    <MenuItem value={category.label} key={index}>
                      <ListItemIcon>{category.icon}</ListItemIcon>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.category?.message}</FormHelperText>
              </FormControl>
            )}
          />
          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                value={field.value === 0 ? '' : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                label="金額"
                type="number"
              />
            )}
          />
          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.content}
                helperText={errors.content?.message}
                label="内容"
                type="text"
              />
            )}
          />
          {/* 保存ボタン */}

          <Button
            type="submit"
            variant="contained"
            color={currentType === 'income' ? 'primary' : 'error'}
            fullWidth
          >
            {selectedTransaction ? '更新' : '保存'}
          </Button>
          {selectedTransaction && (
            <Button
              variant="outlined"
              color={'secondary'}
              fullWidth
              onClick={handleDelete}
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );
  return (
    <>
      {isMobile ? (
        //mobile用
        <Dialog
          open={isDialogOpen}
          onClose={onCloseForm}
          fullWidth
          maxWidth={'sm'}
        >
          <DialogContent>{formContent}</DialogContent>
        </Dialog>
      ) : (
        //PC用
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            right: isEntryDrawerOpen ? formWidth : '-2%', // フォームの位置を調整
            width: formWidth,
            height: '100%',
            bgcolor: 'background.paper',
            zIndex: (theme) => theme.zIndex.drawer - 1,
            transition: (theme) =>
              theme.transitions.create('right', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            p: 2, // 内部の余白
            boxSizing: 'border-box', // ボーダーとパディングをwidthに含める
            boxShadow: '0px 0px 15px -5px #777777',
          }}
        >
          {formContent}
        </Box>
      )}
    </>
  );
};
export default TransactionForm;
