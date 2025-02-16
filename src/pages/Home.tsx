import { Box, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo, useState } from 'react';
import MonthlySummary from '../components/MonthlySummary';
import Calendar from '../components/Calendar';
import TransactionMenu from '../components/TransactionMenu';
import TransactionForm from '../components/TransactionForm';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { Schema } from '../validations/schema';
import { DateClickArg } from '@fullcalendar/interaction/index.js';
import { useAppContext } from '../context/AppContext';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';

// interface HomeProps {
//   monthlyTransactions: Transaction[];
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
//   onSaveTransaction: (transaction: Schema) => Promise<void>;
//   onDeleteTransaction: (
//     transactionId: string | readonly string[]
//   ) => Promise<void>;
//   onUpdateTransaction: (
//     transaction: Schema,
//     transactionId: string
//   ) => Promise<void>;
// }
const Home = () =>
  // {
  // monthlyTransactions,
  // setCurrentMonth,
  // onSaveTransaction,
  // onDeleteTransaction,
  // onUpdateTransaction,
  // }: HomeProps
  {
    const { isMobile } = useAppContext();
    const monthlyTransactions = useMonthlyTransactions();
    const today = format(new Date(), 'yyyy-MM-dd');
    const [currentDay, setCurrentDay] = useState(today);
    const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
    //何も選択してない時はnullを入れる
    const [selectedTransaction, setSelectedTransaction] =
      useState<Transaction | null>(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    // const theme = useTheme();
    //1200px以上ならfalse,以下ならtrueを返す
    // const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    //選択された日付のデータだけを取得する
    const dailyTransactions = useMemo(() => {
      return monthlyTransactions.filter(
        (transaction) => transaction.date === currentDay
      );
    }, [monthlyTransactions, currentDay]);
    //フォームの閉じるボタン(Xマーク)
    const closeForm = () => {
      setSelectedTransaction(null);

      if (isMobile) {
        setIsDialogOpen(!isDialogOpen);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    };

    //フォームの開閉処理(内訳追加ボタン)
    const handleAddTransactionForm = () => {
      if (isMobile) {
        setIsDialogOpen(true);
      } else {
        if (selectedTransaction) {
          setSelectedTransaction(null);
        } else {
          setIsEntryDrawerOpen(!isEntryDrawerOpen);
        }
      }
    };
    //取引が選択された時の処理
    const handleSelectTransaction = (trnsaction: Transaction) => {
      setSelectedTransaction(trnsaction);
      if (isMobile) {
        setIsDialogOpen(true);
      } else {
        setIsEntryDrawerOpen(true);
      }
    };

    const handleDateClick = (dateInfo: DateClickArg) => {
      setCurrentDay(dateInfo.dateStr);
      setIsMobileDrawerOpen(true);
    };
    //モバイル用Drawerを閉じる処理
    const handleCloseMobileDrawer = () => {
      setIsMobileDrawerOpen(false);
    };
    return (
      <Box sx={{ display: 'flex' }}>
        {/* 左側コンテンツ */}
        <Box sx={{ flexGrow: 1 }}>
          <MonthlySummary
          // monthlyTransactions={monthlyTransactions }
          />
          <Calendar
            // monthlyTransactions={monthlyTransactions}
            // setCurrentMonth={setCurrentMonth}
            setCurrentDay={setCurrentDay}
            currentDay={currentDay}
            today={today}
            onDateClick={handleDateClick}
          />
        </Box>
        {/* 右側コンテンツ */}
        <Box>
          <TransactionMenu
            dailyTransactions={dailyTransactions}
            currentDay={currentDay}
            onAddTransactionForm={handleAddTransactionForm}
            onSelectTransaction={handleSelectTransaction}
            // isMobile={isMobile}
            open={isMobileDrawerOpen}
            onClose={handleCloseMobileDrawer}
          />
          <TransactionForm
            onCloseForm={closeForm}
            isEntryDrawerOpen={isEntryDrawerOpen}
            currentDay={currentDay}
            // onSaveTransaction={onSaveTransaction}
            selectedTransaction={selectedTransaction}
            // onDeleteTransaction={onDeleteTransaction}
            setSelectedTransaction={setSelectedTransaction}
            // onUpdateTransaction={onUpdateTransaction}
            // isMobile={isMobile}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </Box>
      </Box>
    );
  };

export default Home;
