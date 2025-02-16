import { createContext, ReactNode, useContext, useState } from 'react';
import { Transaction } from '../types';
import { useMediaQuery, useTheme } from '@mui/material';
import { Schema } from '../validations/schema';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { isFireStoreError } from '../utils/errorHandling';

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (
    transactionIds: string | readonly string[]
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
}
export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const onSaveTransaction = async (transaction: Schema) => {
    try {
      //firestoreにデータを保存する
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, 'Transactions'), transaction);
      console.log('Document written with ID: ', docRef.id);

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      setTransactions((prevTransaction) => [
        ...prevTransaction,
        newTransaction,
      ]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.log('firestoreのエラーは:', err);
      } else {
        console.log('一般的なエラーは:', err);
      }
    }
  };
  const onDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      //引数が配列かどうかチェックする。falseなら[1]のように配列に入れて返す
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];
      for (const id of idsToDelete) {
        //firestoreからデータ削除する
        await deleteDoc(doc(db, 'Transactions', id));
      }
      // const filterdTransactions = transactions.filter(
      //   (transaction) => transaction.id !== transactionId
      // );
      const filterdTransactions = transactions.filter(
        //transaction.idがidsToDeleteの配列に含まれていたらtrueになる
        //!で上記の内容を逆にしている
        (transaction) => !idsToDelete.includes(transaction.id)
        // 1. 既存の全取引データ(transactions)から、削除対象の取引を除外した新しい配列を作成
        // 2. filter()メソッドは、条件に一致する要素だけを含む新しい配列を返す
        // const filterdTransactions = transactions.filter(
        // 3. 各取引(transaction)に対して以下の条件をチェック
        // 4. transaction.id !== transactionId は、
        //    「取引のID」が「削除対象のID」と異なる場合にtrueを返す
        // 5. つまり、削除対象以外の取引だけを残す
        //   (transaction) => transaction.id !== transactionId
      );
      setTransactions(filterdTransactions);
      console.log(filterdTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.log('firestoreのエラーは:', err);
      } else {
        console.log('一般的なエラーは:', err);
      }
    }
  };
  const onUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      //firestore更新処理
      //更新対象
      const docRef = doc(db, 'Transactions', transactionId);

      //更新する内容
      await updateDoc(docRef, transaction);
      //フロント更新
      //{...t}は更新前
      //let t = {id: 1, type: "expense", amount: 100};
      //{...transaction}は更新後
      //let transaction = {type: "expense", amount: 200};
      //{...t, ...transaction}は合体
      //{id: 1, type: "expense", amount: 200}
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      );
      setTransactions(updatedTransactions);
    } catch {
      if (isFireStoreError(err)) {
        console.log('firestoreのエラーは:', err);
      } else {
        console.log('一般的なエラーは:', err);
      }
    }
  };
  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        isLoading,
        setIsLoading,
        isMobile,
        onSaveTransaction,
        onDeleteTransaction,
        onUpdateTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    //contextがundefinedの場合の処理
    throw new Error('グローバルなデータはプロバイダーの中で取得してください');
  }
  return context;
};
