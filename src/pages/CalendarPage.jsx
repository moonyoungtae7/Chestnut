import React, { useState } from 'react';
import ChestnutCharacter from '../components/ChestnutCharacter';
import './CalendarPage.css';

const CalendarPage = ({ entries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = [];
  // Add empty slots for days of previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Add days of current month
  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  const getEntriesForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries.filter(e => e.createdAt.startsWith(dateStr));
  };

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <h1>{monthNames[month]} {year}</h1>
        <div className="calendar-nav">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>&lt;</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>&gt;</button>
        </div>
      </header>

      <div className="calendar-grid">
        <div className="day-header">Sun</div>
        <div className="day-header">Mon</div>
        <div className="day-header">Tue</div>
        <div className="day-header">Wed</div>
        <div className="day-header">Thu</div>
        <div className="day-header">Fri</div>
        <div className="day-header">Sat</div>

        {days.map((day, index) => {
          const dayEntries = getEntriesForDay(day);
          const hasEntries = dayEntries.length > 0;
          const isMultiple = dayEntries.length > 1;
          
          return (
            <div key={index} className={`calendar-day ${!day ? 'empty' : ''}`}>
              {day && (
                <>
                  <span className="day-num">{day}</span>
                  {hasEntries && (
                    <div className="day-chestnut">
                      <ChestnutCharacter 
                        type="big" 
                        size={40} 
                        color={isMultiple ? 'white' : dayEntries[0].parent.emotion.hex}
                        isRainbow={isMultiple}
                        hoverEffect={false}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;
