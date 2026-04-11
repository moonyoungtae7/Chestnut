import React, { useState } from 'react';
import DiaryCard from '../components/DiaryCard';
import './MyStoryPage.css';

const MyStoryPage = ({ entries, user, onLogin, onLogout }) => {
  const [filterTarget, setFilterTarget] = useState('parent'); // 'parent' or 'child'
  const [filterVibe, setFilterVibe] = useState('all'); // 'all', 'positive', 'negative', 'contextual'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState('');

  const filteredEntries = entries.filter((entry) => {
    const targetData = entry[filterTarget];
    
    // If we're filtering for a specific vibe, the target MUST have an emotion
    if (filterVibe !== 'all') {
      if (!targetData.emotion) return false;
      return targetData.emotion.vibe === filterVibe;
    }
    
    // For 'all' filter:
    // If target is child, only show entries where child emotion was recorded
    if (filterTarget === 'child') {
      return !!targetData.emotion;
    }
    
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (email && password) {
      try {
        await onLogin({ email, password, isSignUp });
        if (!isSignUp) {
          setEmail('');
          setPassword('');
          setIsMenuOpen(false);
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="my-story-page">
      <header className="story-header">
        <div className="header-top">
          <h1>Chestnut - My Story</h1>
          <button 
            className={`account-toggle ${user ? 'logged-in' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {user ? (
              <span className="user-initial">{user.email[0].toUpperCase()}</span>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </button>
        </div>

        {/* Floating Account Menu */}
        {isMenuOpen && (
          <div className="account-dropdown slide-up">
            {!user ? (
              <div className="dropdown-inner">
                <div className="banner-text">
                  <h3>☁️ Sync Your Stories</h3>
                  <p>Create an account to continue using across Mobile and PC without losing any diaries.</p>
                </div>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="auth-error">{error}</p>}
                  <div className="auth-actions">
                    <button type="submit" className="auth-btn">
                      {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                    <button 
                      type="button" 
                      className="toggle-auth" 
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                      }}
                    >
                      {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="dropdown-inner user-active">
                <div className="user-info">
                  <div className="user-chip">
                    <span className="user-chip-icon">👤</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <p className="sync-status">✓ Cloud Sync Active</p>
                </div>
                <button 
                  className="logout-btn" 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}

        <div className="filter-tabs">
          <button 
            className={`tab ${filterTarget === 'parent' ? 'active' : ''}`}
            onClick={() => setFilterTarget('parent')}
          >
            Big Chestnut
          </button>
          <button 
            className={`tab ${filterTarget === 'child' ? 'active' : ''}`}
            onClick={() => setFilterTarget('child')}
          >
            Little Chestnut
          </button>
        </div>
      </header>


      <div className="vibe-filters">
        <button 
          className={`vibe-btn ${filterVibe === 'all' ? 'active' : ''}`}
          onClick={() => setFilterVibe('all')}
        >
          All
        </button>
        <button 
          className={`vibe-btn positive ${filterVibe === 'positive' ? 'active' : ''}`}
          onClick={() => setFilterVibe('positive')}
        >
          Positive
        </button>
        <button 
          className={`vibe-btn negative ${filterVibe === 'negative' ? 'active' : ''}`}
          onClick={() => setFilterVibe('negative')}
        >
          Negative
        </button>
        <button 
          className={`vibe-btn contextual ${filterVibe === 'contextual' ? 'active' : ''}`}
          onClick={() => setFilterVibe('contextual')}
        >
          Contextual
        </button>
      </div>

      <main className="story-feed">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="empty-state">
             <p>No diaries found for this filter.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyStoryPage;
