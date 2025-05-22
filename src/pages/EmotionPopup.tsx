import React, { useState } from 'react';
import '../style/common.css';

interface EmotionPopupProps {
  onClose: () => void;
  onSave: (emotion: string) => void;
}

const EmotionPopup: React.FC<EmotionPopupProps> = ({ onClose, onSave }) => {
  const [emotion, setEmotion] = useState('');

  const handleSave = () => {
    if (emotion.trim() === '') return;
    onSave(emotion);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>이 시간을 보낸 당신의 감정은?</h3>
        <textarea
          placeholder="당신의 감정을 입력해 주세요"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          rows={3}
        />
        <div className="popup-buttons">
          <button className="popup-button" onClick={handleSave}>
            기록하고 나가기
          </button>
          <button className="popup-button cancel" onClick={onClose}>
            그냥 나가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmotionPopup;
