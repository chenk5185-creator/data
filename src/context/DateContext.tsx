import { createContext, useContext, useState, type ReactNode } from 'react';
import dayjs, { type Dayjs } from 'dayjs';

interface DateContextType {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};
