import { useState, useEffect } from 'react';

const STORAGE_KEY = 'chestnut_diary_entries';

export const useDiaryEntries = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry) => {
    // Add date to entry
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const getEntriesForDate = (dateString) => {
    // dateString should be YYYY-MM-DD
    return entries.filter(e => e.createdAt.startsWith(dateString));
  };

  return { entries, addEntry, getEntriesForDate };
};
