import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { Transaction } from './types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';
import { AppContextProvider} from './context/AppContext';
function App() {
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [isLoading, setIsLoading] = useState(false);
  // //Firestoreエラーかどうか判定する型ガード
  // function isFireStoreError(
  //   // unknown型は TypeScript で「どんな値が来るか分からない」ことを表す最も安全な型
  //   err: unknown
  //   // 「err is { code: string; message: string }」は、
  //   // trueを返した場合、errが「codeとmessageというstring型のプロパティを持つオブジェクト」であることを保証する
  // ): err is { code: string; message: string } {
  //   // ①: まず err が object 型かどうかをチェック
  //   // ②: err が null でないことをチェック（JavaScriptでは typeof null も 'object' を返すため）
  //   // ③: err オブジェクトに 'code' プロパティが存在するかチェック
  //   return typeof err === 'object' && err !== null && 'code' in err;
  // }




  //取引を保存する処理
  // const handleSaveTransaction = async (transaction: Schema) => {
  //   try {
  //     //firestoreにデータを保存する
  //     // Add a new document with a generated id.
  //     const docRef = await addDoc(collection(db, 'Transactions'), transaction);
  //     console.log('Document written with ID: ', docRef.id);

  //     const newTransaction = {
  //       id: docRef.id,
  //       ...transaction,
  //     } as Transaction;
  //     setTransactions((prevTransaction) => [
  //       ...prevTransaction,
  //       newTransaction,
  //     ]);
  //   } catch (err) {
  //     if (isFireStoreError(err)) {
  //       console.log('firestoreのエラーは:', err);
  //     } else {
  //       console.log('一般的なエラーは:', err);
  //     }
  //   }
  // };
  // //削除処理
  // const handleDeleteTransaction = async (
  //   transactionIds: string | readonly string[]
  // ) => {
  //   try {
  //     //引数が配列かどうかチェックする。falseなら[1]のように配列に入れて返す
  //     const idsToDelete = Array.isArray(transactionIds)
  //       ? transactionIds
  //       : [transactionIds];
  //     for (const id of idsToDelete) {
  //       //firestoreからデータ削除する
  //       await deleteDoc(doc(db, 'Transactions', id));
  //     }
  //     // const filterdTransactions = transactions.filter(
  //     //   (transaction) => transaction.id !== transactionId
  //     // );
  //     const filterdTransactions = transactions.filter(
  //       //transaction.idがidsToDeleteの配列に含まれていたらtrueになる
  //       //!で上記の内容を逆にしている
  //       (transaction) => !idsToDelete.includes(transaction.id)
  //       // 1. 既存の全取引データ(transactions)から、削除対象の取引を除外した新しい配列を作成
  //       // 2. filter()メソッドは、条件に一致する要素だけを含む新しい配列を返す
  //       // const filterdTransactions = transactions.filter(
  //       // 3. 各取引(transaction)に対して以下の条件をチェック
  //       // 4. transaction.id !== transactionId は、
  //       //    「取引のID」が「削除対象のID」と異なる場合にtrueを返す
  //       // 5. つまり、削除対象以外の取引だけを残す
  //       //   (transaction) => transaction.id !== transactionId
  //     );
  //     setTransactions(filterdTransactions);
  //     console.log(filterdTransactions);
  //   } catch (err) {
  //     if (isFireStoreError(err)) {
  //       console.log('firestoreのエラーは:', err);
  //     } else {
  //       console.log('一般的なエラーは:', err);
  //     }
  //   }
  // };
  // const handleUpdateTransaction = async (
  //   transaction: Schema,
  //   transactionId: string
  // ) => {
  //   try {
  //     //firestore更新処理
  //     //更新対象
  //     const docRef = doc(db, 'Transactions', transactionId);

  //     //更新する内容
  //     await updateDoc(docRef, transaction);
  //     //フロント更新
  //     //{...t}は更新前
  //     //let t = {id: 1, type: "expense", amount: 100};
  //     //{...transaction}は更新後
  //     //let transaction = {type: "expense", amount: 200};
  //     //{...t, ...transaction}は合体
  //     //{id: 1, type: "expense", amount: 200}
  //     const updatedTransactions = transactions.map((t) =>
  //       t.id === transactionId ? { ...t, ...transaction } : t
  //     );
  //     setTransactions(updatedTransactions);
  //   } catch {
  //     if (isFireStoreError(err)) {
  //       console.log('firestoreのエラーは:', err);
  //     } else {
  //       console.log('一般的なエラーは:', err);
  //     }
  //   }
  // };
  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route
                index
                element={
                  <Home
                    // monthlyTransactions={monthlyTransactions}
                    // setCurrentMonth={setCurrentMonth}
                    // onSaveTransaction={handleSaveTransaction}
                    // onDeleteTransaction={handleDeleteTransaction}
                    // onUpdateTransaction={handleUpdateTransaction}
                  />
                }
              />
              <Route
                path="/report"
                element={
                  <Report
                    // currentMonth={currentMonth}
                    // setCurrentMonth={setCurrentMonth}
                    // monthlyTransactions={monthlyTransactions}
                    // isLoading={isLoading}
                    // onDeleteTransaction={handleDeleteTransaction}
                  />
                }
              />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
