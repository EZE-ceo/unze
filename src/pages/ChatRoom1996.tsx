// src/pages/ChatRoom1996.tsx
import React, { useState } from 'react';
import ChatRoom1996_Send from './ChatRoom1996_Send';
import ChatRoom1996_Received from "./ChatRoom1996_Received";

const ChatRoom1996 = () => {
  const [mode, setMode] = useState<'send' | 'receive'>('send');
  const [sentNumber, setSentNumber] = useState<string>('');

  const handleSend = (number: string) => {
    setSentNumber(number);
    setMode('receive');
  };

  return (
    <>
      {mode === 'send' ? (
        <ChatRoom1996_Send onSend={handleSend} />
      ) : (
        <ChatRoom1996_Received phoneNumber={sentNumber} />
      )}
    </>
  );
};

export default ChatRoom1996;
