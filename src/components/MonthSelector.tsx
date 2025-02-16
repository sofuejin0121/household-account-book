import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';
import { Box, Button } from '@mui/material';
import React from 'react';
import { addMonths } from 'date-fns';
import { useAppContext } from '../context/AppContext';

// interface MonthSelectorProps {
//   currentMonth: Date;
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
// }

const MonthSelector = (
//   {
//   currentMonth,
//   setCurrentMonth,
// }: MonthSelectorProps
) => {
  const {currentMonth, setCurrentMonth} = useAppContext()

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setCurrentMonth(newDate);
    }
  };
  //先月ボタンを押した時の処理
  const handlePriviousMonth = () => {
    const previousMonth = addMonths(currentMonth, -1);
    setCurrentMonth(previousMonth);
  };
  //翌月ボタンを押した時の処理
  const handleNextMonth = () => {
    const NextMonth = addMonths(currentMonth, +1);
    setCurrentMonth(NextMonth);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Button
          onClick={handlePriviousMonth}
          color={'error'}
          variant="contained"
        >
          先月
        </Button>
        <DatePicker
          onChange={handleDateChange}
          value={currentMonth}
          label="年月を選択"
          sx={{ mx: 2, background: 'white' }}
          views={['year', 'month']}
          format="yyyy/MM"
          slotProps={{
            toolbar: {
              toolbarFormat: 'yyyy年MM月',
            },
          }}
        />
        <Button onClick={handleNextMonth} color={'primary'} variant="contained">
          翌月
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthSelector;
