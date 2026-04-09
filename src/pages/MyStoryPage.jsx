import React, { useState } from 'react';
import DiaryCard from '../components/DiaryCard';
import './MyStoryPage.css';

const MyStoryPage = ({ entries }) => {
  const [filterTarget, setFilterTarget] = useState('parent'); // 'parent' or 'child'
  const [filterVibe, setFilterVibe] = useState('all'); // 'all', 'positive', 'negative', 'contextual'

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

  return (
    <div className="my-story-page">
      <header className="story-header">
        <h1>Chestnut - My Story</h1>
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
