import React, { useState } from 'react';
import ChestnutCharacter from './components/ChestnutCharacter';
import EmotionDropdown from './components/EmotionDropdown';
import './DiaryPage.css';

const DiaryPage = ({ onSave, onNavigate }) => {
  const [parentEmotion, setParentEmotion] = useState(null);
  const [parentText, setParentText] = useState('');
  const [childEmotion, setChildEmotion] = useState(null);
  const [childText, setChildText] = useState('');

  const handleCreate = () => {
    onSave({
      parent: {
        emotion: parentEmotion,
        text: parentText
      },
      child: {
        emotion: childEmotion,
        text: childText
      }
    });
    
    // Reset form and navigate to story feed
    setParentEmotion(null);
    setParentText('');
    setChildEmotion(null);
    setChildText('');
    onNavigate('story');
  };

  return (
    <div className="diary-page">
      <header className="diary-header">
        <h1>Chestnut</h1>
        <div className="nav-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </header>

      <main className="diary-content">
        {/* Parent Section */}
        <section className="diary-section">
          <ChestnutCharacter 
            type="big" 
            color={parentEmotion ? parentEmotion.hex : 'white'} 
          />
          <span className="character-nametag">Big Chestnut</span>
          <EmotionDropdown 
            selectedEmotion={parentEmotion} 
            onSelect={setParentEmotion} 
            placeholder="What's the one word that best describes your feelings?"
          />
          <textarea 
            className="diary-input"
            placeholder="What happened to make you feel that way?"
            value={parentText}
            onChange={(e) => setParentText(e.target.value)}
          />
        </section>

        <div className="divider"></div>

        {/* Child Section */}
        <section className="diary-section">
          <ChestnutCharacter 
            type="little" 
            color={childEmotion ? childEmotion.hex : 'white'} 
          />
          <span className="character-nametag">Little Chestnut</span>
          <EmotionDropdown 
            selectedEmotion={childEmotion} 
            onSelect={setChildEmotion} 
            placeholder="What do you think Little Chestnut felt?"
          />
          <textarea 
            className="diary-input"
            placeholder="What do you think caused Little Chestnut to behave that way and show such emotion?"
            value={childText}
            onChange={(e) => setChildText(e.target.value)}
          />
        </section>

        <div className="button-group">
          <button 
            className="cancel-button"
            onClick={() => {
              setParentEmotion(null);
              setParentText('');
              setChildEmotion(null);
              setChildText('');
              onNavigate('story');
            }}
          >
            Cancel
          </button>
          <button 
            className="create-button"
            onClick={handleCreate}
            disabled={!parentEmotion || !parentText.trim()}
          >
            Create Diary
          </button>
        </div>
      </main>
    </div>
  );
};

export default DiaryPage;
