import React, { useState } from 'react';
import ChestnutCharacter from '../components/ChestnutCharacter';
import DiaryCard from '../components/DiaryCard';
import './CalendarPage.css';

const CalendarPage = ({ entries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntries, setSelectedEntries] = useState(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState('');

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
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  const getEntriesForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries.filter(e => e.createdAt.startsWith(dateStr));
  };

  const handleDayClick = (day, dayEntries) => {
    if (dayEntries.length === 0) return;
    
    // Sort newest to oldest
    const sorted = [...dayEntries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setSelectedEntries(sorted);
    setSelectedDateLabel(`${monthNames[month]} ${day}, ${year}`);
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEntries(null);
    document.body.style.overflow = 'unset';
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
            <div 
              key={index} 
              className={`calendar-day ${!day ? 'empty' : ''} ${hasEntries ? 'has-content' : ''}`}
              onClick={() => handleDayClick(day, dayEntries)}
            >
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

      {/* Diary Modal */}
      {selectedEntries && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <div className="modal-title-area">
                <h2>{selectedDateLabel}</h2>
                <span className="entry-count">{selectedEntries.length} stories</span>
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </header>
            <div className="modal-feed">
              {selectedEntries.map(entry => (
                <DiaryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
