import React from 'react';
import './ChestnutCharacter.css';

const ChestnutCharacter = ({ type = 'big', color = 'white', hoverEffect = true, isRainbow = false, size: propsSize }) => {
  const isBig = type === 'big';
  const size = propsSize || (isBig ? 120 : 80);
  
  return (
    <div className={`chestnut-container ${isBig ? 'big' : 'little'} ${hoverEffect ? 'hover-enabled' : ''}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="chestnut-svg"
      >
        <defs>
          <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />   {/* Red */}
            <stop offset="16%" stopColor="#FF9E4D" />  {/* Orange */}
            <stop offset="33%" stopColor="#FFD93D" />  {/* Yellow */}
            <stop offset="50%" stopColor="#6BCB77" />  {/* Green */}
            <stop offset="66%" stopColor="#4D96FF" />  {/* Blue */}
            <stop offset="83%" stopColor="#8A2BE2" />  {/* Indigo */}
            <stop offset="100%" stopColor="#A760FF" /> {/* Violet */}
          </linearGradient>
        </defs>

        {/* Main Body */}
        <path
          d="M50 5C30 20 5 40 5 65C5 88 25 95 50 95C75 95 95 88 95 65C95 40 70 20 50 5Z"
          fill={isRainbow ? "url(#rainbowGradient)" : (color === 'white' ? '#FFFFFF' : color)}
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Bottom Wavy Part (Outer shell/Cap) */}
        <path
          d="M7 70C20 65 35 75 50 75C65 75 80 65 93 70"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Eyes */}
        <circle cx="40" cy="55" r="2.5" fill="#000000" />
        <circle cx="60" cy="55" r="2.5" fill="#000000" />
      </svg>
      <div className="chestnut-shadow"></div>
    </div>
  );
};

export default ChestnutCharacter;
