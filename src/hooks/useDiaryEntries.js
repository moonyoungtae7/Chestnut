import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'chestnut_diary_entries';

export const useDiaryEntries = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Persistence for Guest entries
  useEffect(() => {
    // Only save to localStorage if we're not fully synced yet or as a backup
    // Actually, we'll keep it simple: sync cloud to state, sync state to local
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const fetchEntries = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Map Supabase fields back to our React structure
      const cloudEntries = data.map(item => ({
        ...item,
        // Supabase has flat fields or jsonb. I used jsonb in my SQL plan.
        id: item.id,
        createdAt: item.created_at,
        parent: item.parent,
        child: item.child,
        userId: item.user_id
      }));

      setEntries(prev => {
        // Merge: Cloud entries + local anonymous entries
        const guestEntries = prev.filter(e => !e.userId);
        return [...cloudEntries, ...guestEntries];
      });
    }
    setLoading(false);
  };

  const addEntry = async (entry, userId = null) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(), // Temporary ID for local state
      createdAt: new Date().toISOString(),
      userId: userId
    };

    // Update state immediately for UX
    setEntries((prev) => [newEntry, ...prev]);

    // If logged in, sync to Supabase
    if (userId) {
      const { data, error } = await supabase
        .from('entries')
        .insert({
          user_id: userId,
          parent: entry.parent,
          child: entry.child,
          created_at: newEntry.createdAt
        })
        .select()
        .single();

      if (!error && data) {
        // Replace temp entry with real Supabase entry (contains real UUID)
        setEntries(prev => prev.map(e => e.id === newEntry.id ? {
          ...e,
          id: data.id,
          userId: data.user_id
        } : e));
      } else if (error) {
        console.error('Sync error:', error.message);
      }
    }
  };

  const migrateEntries = async (userId) => {
    const guestEntries = entries.filter(e => !e.userId);
    if (guestEntries.length === 0) {
      // If no guest entries, just fetch what's in the cloud
      fetchEntries(userId);
      return;
    }

    // Upload guest entries to Supabase
    const toUpload = guestEntries.map(e => ({
      user_id: userId,
      parent: e.parent,
      child: e.child,
      created_at: e.createdAt
    }));

    const { error } = await supabase.from('entries').insert(toUpload);

    if (!error) {
      // After upload, fetch all cloud entries and clear locals
      fetchEntries(userId);
    } else {
      console.error('Migration error:', error.message);
    }
  };

  const getEntriesForDate = (dateString) => {
    return entries.filter(e => e.createdAt.startsWith(dateString));
  };

  return { 
    entries, 
    addEntry, 
    getEntriesForDate, 
    migrateEntries, 
    loading 
  };
};
