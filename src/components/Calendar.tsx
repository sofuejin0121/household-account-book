import FullCalendar from '@fullcalendar/react';
import React from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import '../calendar.css';
import { DatesSetArg, EventContentArg } from '@fullcalendar/core/index.js';
import { Balance, CalendarContent, Transaction } from '../types';
import { calculateDailyBalances } from '../utils/financeCalculations';
import { formatCurrency } from '../utils/formatting';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useTheme } from '@mui/material';
import { isSameMonth } from 'date-fns';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';
import { useAppContext } from '../context/AppContext';

interface CalendarProps {
  // monthlyTransactions: Transaction[];
  // setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
  onDateClick:(dateInfo: DateClickArg) => void;
}

const Calendar = ({
  // monthlyTransactions,
  // setCurrentMonth,
  setCurrentDay,
  currentDay,
  today,
  onDateClick,
}: CalendarProps) => {
  const monthlyTransactions = useMonthlyTransactions()
  const {setCurrentMonth}= useAppContext()
  const theme = useTheme();
  // const events = [
  //   {
  //     title: 'Meeting',
  //     start: new Date(),
  //     income: 300,
  //     expense: 200,
  //     balance: 100,
  //   },
  // ];
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className="money" id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>
        <div className="money" id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className="money" id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };
  //月の日付取得
  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    //todayDateには今月の情報、currentMonthには、現在表示中の月が入っている
    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    }
  };

  //月間の取引データ（monthlyTransactions）から日々の収支バランスを計算
  const dailyBalances = calculateDailyBalances(monthlyTransactions);

  //FullCalendar用のイベント生成関数
  const createCalendarEvents = (
    dailyBalances: Record<string, Balance>
  ): CalendarContent[] => {
    //Object.keys()でdailyBalancesのすべての日付（キー）を取得
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };

  //選択した日付に背景色をつけるイベント
  const backgroundEvent = {
    start: currentDay,
    display: 'background',
    backgroundColor: theme.palette.incomeColor.light,
  };

  const calendarEvents = createCalendarEvents(dailyBalances);
  console.log(calendarEvents);

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      //スプレッド演算子で展開して、展開した中にbackgroundEventのオブジェクトを追加する
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onDateClick}
    />
  );
};

export default Calendar;
