import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
`;

const ChatHeader = styled.div`
  padding: 15px;
  font-weight: 700;
  color: #d4af37;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%);
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
  
  svg {
    margin-right: 8px;
    color: #d4af37;
  }
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(10, 34, 25, 0.3);
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(10, 34, 25, 0.5);
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #d4af37, #f4d03f);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #f4d03f, #d4af37);
  }
`;

const MessageBubble = styled.div`
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
  
  ${props => props.type === 'system' && `
    align-self: center;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(10, 34, 25, 0.5) 100%);
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #d4af37;
    font-style: italic;
    font-size: 0.9rem;
    max-width: 100%;
    text-align: center;
    font-weight: 500;
  `}
  
  ${props => props.type === 'message' && `
    align-self: ${props.$isMine ? 'flex-end' : 'flex-start'};
    background: ${props.$isMine 
      ? 'linear-gradient(135deg, rgba(20, 75, 47, 0.9) 0%, rgba(10, 34, 25, 0.9) 100%)' 
      : 'linear-gradient(135deg, rgba(10, 34, 25, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%)'};
    border: 1px solid ${props.$isMine ? 'rgba(76, 175, 80, 0.5)' : 'rgba(212, 175, 55, 0.3)'};
    color: white;
  `}
`;

const MessageSender = styled.div`
  font-weight: 700;
  font-size: 0.8rem;
  margin-bottom: 4px;
  color: ${props => props.$isMine ? '#90EE90' : '#d4af37'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MessageTime = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin-left: 8px;
`;

const InputContainer = styled.form`
  display: flex;
  padding: 12px;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%);
  border-top: 2px solid rgba(212, 175, 55, 0.3);
`;

const ChatInput = styled.input`
  flex-grow: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  background-color: rgba(10, 34, 25, 0.8);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
    background-color: rgba(10, 34, 25, 1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: rgba(117, 117, 117, 0.5);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Chat = () => {
  const { messages, sendMessage, username } = useGame();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    sendMessage(messageInput);
    setMessageInput('');
  };
  
  return (
    <ChatContainer>
      <ChatHeader style={{ display: 'none' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18"></path>
        </svg>
        Game Chat
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            type={message.type} 
            $isMine={message.sender === username}
          >
            {message.type === 'message' && (
              <MessageSender $isMine={message.sender === username}>
                {message.sender}
                <MessageTime>{formatTime(message.timestamp)}</MessageTime>
              </MessageSender>
            )}
            {message.content}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer onSubmit={handleSubmit}>
        <ChatInput 
          type="text" 
          placeholder="Type a message..." 
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <SendButton type="submit" disabled={!messageInput.trim()}>
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat; 