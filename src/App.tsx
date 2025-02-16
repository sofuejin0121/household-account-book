import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { AppContextProvider } from './context/AppContext';
function App() {
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
