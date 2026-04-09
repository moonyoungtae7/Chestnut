import React from 'react';
import ChestnutCharacter from './ChestnutCharacter';
import './DiaryCard.css';

const DiaryCard = ({ entry }) => {
  const { parent, child, createdAt } = entry;
  const dateStr = new Date(createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="diary-card">
      <div className="card-header">
        <span className="card-date">{dateStr}</span>
      </div>
      
      <div className="card-characters">
        <div className="card-char-item">
          <ChestnutCharacter 
            type="big" 
            color={parent.emotion.hex} 
            hoverEffect={false} 
          />
          <span className="char-label">Big Chestnut</span>
        </div>
        <div className="card-char-item">
          <ChestnutCharacter 
            type="little" 
            color={child.emotion ? child.emotion.hex : 'white'} 
            hoverEffect={false} 
          />
          <span className="char-label">Little Chestnut</span>
        </div>
      </div>

      <div className="card-content">
        <div className="content-section">
          <h4>Big Chestnut's Story</h4>
          <p>{parent.text}</p>
          <span className="emotion-tag" style={{ color: parent.emotion.hex }}>#{parent.emotion.label_en}</span>
        </div>
        {child.emotion && (
          <div className="content-section">
            <h4>Little Chestnut's Story</h4>
            <p>{child.text || 'No story shared.'}</p>
            <span className="emotion-tag" style={{ color: child.emotion.hex }}>#{child.emotion.label_en}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryCard;
