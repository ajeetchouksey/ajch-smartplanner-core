import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CompactCalendar: React.FC = () => {
  const [value, setValue] = useState(new Date());
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '18px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
      minHeight: 0,
      width: '100%',
      maxWidth: 340,
      margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.12)'
    }}>
      <Calendar
        onChange={setValue}
        value={value}
        calendarType="ISO 8601"
        showNeighboringMonth={false}
        prev2Label={null}
        next2Label={null}
        tileClassName={({ date, view }) =>
          view === 'month' && date.toDateString() === new Date().toDateString()
            ? 'react-calendar__tile--active-today'
            : undefined
        }
      />
    </div>
  );
};

export default CompactCalendar;
