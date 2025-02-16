import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatMonth } from '../utils/formatting';
import { Transaction } from '../types';

const useMonthlyTransactions = ():Transaction[] => {
  const { transactions, currentMonth } = useAppContext();
  //月間の取引データを取得
  //現在表示している月の取引データのみがmonthlyTransactionsに格納され、カレンダーにはその月のデータのみが表示される
  const monthlyTransactions = useMemo(() => {
    //transactions,currentMonthの変更があったときだけ月間のデータを取得する
    return transactions.filter((transaction) =>
      transaction.date.startsWith(formatMonth(currentMonth))
    );
  }, [transactions, currentMonth]);

  return monthlyTransactions;
};

export default useMonthlyTransactions;
