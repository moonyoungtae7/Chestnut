import React, { useState, useEffect } from 'react';
import DiaryPage from './DiaryPage';
import CalendarPage from './pages/CalendarPage';
import MyStoryPage from './pages/MyStoryPage';
import { useDiaryEntries } from './hooks/useDiaryEntries';
import { supabase } from './lib/supabase';
import './index.css';

function App() {
  const [activePage, setActivePage] = useState('diary');
  const [user, setUser] = useState(null);
  const { entries, addEntry, migrateEntries } = useDiaryEntries();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        migrateEntries(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        migrateEntries(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async ({ email, password, isSignUp }) => {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: email.split('@')[0], // Simplified name
          }
        }
      });
      if (error) throw error;
      if (data?.user?.identities?.length === 0) {
        throw new Error('User already exists');
      }
      alert('Success! Check your email for the confirmation link.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'diary':
        return (
          <DiaryPage 
            onSave={(entry) => addEntry(entry, user?.email)} 
            onNavigate={setActivePage} 
          />
        );
      case 'calendar':
        return <CalendarPage entries={entries} />;
      case 'story':
        return (
          <MyStoryPage 
            entries={entries} 
            user={user} 
            onLogin={handleLogin} 
            onLogout={handleLogout} 
          />
        );
      default:
        return (
          <DiaryPage 
            onSave={(entry) => addEntry(entry, user?.email)} 
            onNavigate={setActivePage} 
          />
        );
    }
  };

  return (
    <div className="App">
      <div key={activePage} className="fade-in">
        {renderPage()}
      </div>
      
      {/* Global Bottom Navigation if needed, or included in pages */}
      {/* I'll let pages handle their own headers but maybe App handles the footer for consistency */}
      <footer className="diary-footer">
        <nav className="bottom-nav">
          <div 
            className={`nav-item ${activePage === 'diary' ? 'active' : ''}`}
            onClick={() => setActivePage('diary')}
          >
            <span className="nav-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </span>
            <span>Diary</span>
          </div>
          <div 
            className={`nav-item ${activePage === 'calendar' ? 'active' : ''}`}
            onClick={() => setActivePage('calendar')}
          >
            <span className="nav-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span>Calendar</span>
          </div>
          <div 
            className={`nav-item ${activePage === 'story' ? 'active' : ''}`}
            onClick={() => setActivePage('story')}
          >
            <span className="nav-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </span>
            <span>My Story</span>
          </div>
        </nav>
      </footer>
    </div>
  );
}

export default App;
