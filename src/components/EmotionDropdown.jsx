import React, { useState } from 'react';
import { EMOTIONS } from '../data/emotions';
import './EmotionDropdown.css';

const EmotionDropdown = ({ selectedEmotion, onSelect, placeholder = 'Select an emotion' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (emotion) => {
    onSelect(emotion);
    setIsOpen(false);
  };

  const selectedLabel = selectedEmotion ? selectedEmotion.label_en : placeholder;

  // Group emotions by parent
  const parentEmotions = EMOTIONS.filter(e => e.parent === null);
  
  return (
    <div className="emotion-dropdown-container">
      <div 
        className={`dropdown-header ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="selected-label">
          {selectedEmotion && (
            <span 
              className="color-dot" 
              style={{ backgroundColor: selectedEmotion.hex }}
            ></span>
          )}
          {selectedLabel}
        </span>
        <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▾</span>
      </div>

      {isOpen && (
        <div className="dropdown-list">
          {parentEmotions.map(parent => {
            const children = EMOTIONS.filter(e => e.parent === parent.id);
            return (
              <div key={parent.id} className="emotion-group">
                <div 
                  className="emotion-item parent"
                  onClick={() => handleSelect(parent)}
                  style={{ borderLeft: `4px solid ${parent.hex}` }}
                >
                  {parent.label_en}
                </div>
                {children.map(child => (
                  <div 
                    key={child.id} 
                    className="emotion-item child"
                    onClick={() => handleSelect(child)}
                    style={{ borderLeft: `4px solid ${child.hex}` }}
                  >
                    {child.label_en}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmotionDropdown;
