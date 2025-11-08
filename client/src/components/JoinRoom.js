import React, { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';

const JoinContainer = styled.div`
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  color: #d4af37;
  text-align: center;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: #d4af37;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: 8px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  background-color: rgba(10, 34, 25, 0.8);
  color: white;
  font-size: 16px;
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

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CreateButton = styled(Button)`
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: linear-gradient(135deg, #666 0%, #555 100%);
  }
`;

const JoinButton = styled(Button)`
  background: linear-gradient(135deg, rgba(20, 75, 47, 0.8) 0%, rgba(10, 34, 25, 0.9) 100%);
  color: #d4af37;
  border: 2px solid rgba(212, 175, 55, 0.5);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(20, 75, 47, 1) 0%, rgba(10, 34, 25, 1) 100%);
    border-color: #d4af37;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: linear-gradient(135deg, rgba(50, 50, 50, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%);
    border-color: rgba(100, 100, 100, 0.5);
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
`;

const JoinRoom = () => {
  const { username } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const [localError, setLocalError] = useState(null);
  const { createRoom, joinRoom, error, connected } = useGame();
  
  const handleCreateRoom = (e) => {
    e.preventDefault();
    
    // Username comes from auth context now, no need to check
    createRoom();
    // Don't navigate immediately, wait for room_joined event in GameContext
  };
  
  const handleJoinRoom = (e) => {
    e.preventDefault();
    
    if (!roomCode.trim()) {
      setLocalError('Please enter a room code');
      return;
    }
    
    // Username comes from auth context now
    joinRoom(roomCode.toUpperCase());
    // Don't navigate immediately, wait for room_joined event in GameContext
  };
  
  return (
    <JoinContainer>
      <Title>Join the Game</Title>
      <Form>
        <div style={{ 
          padding: '15px', 
          background: 'rgba(212, 175, 55, 0.1)', 
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#d4af37',
          fontWeight: 600
        }}>
          Playing as: {username}
        </div>
        
        <InputGroup>
          <Label htmlFor="roomCode">Room Code (for joining)</Label>
          <Input
            id="roomCode"
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter room code to join"
            maxLength={6}
          />
        </InputGroup>
        
        <ButtonGroup>
          <CreateButton onClick={handleCreateRoom} disabled={!connected}>
            Create New Room
          </CreateButton>
          <JoinButton onClick={handleJoinRoom} disabled={!connected}>
            Join Room
          </JoinButton>
        </ButtonGroup>
        
        {(localError || error) && (
          <ErrorMessage>{localError || error}</ErrorMessage>
        )}
      </Form>
    </JoinContainer>
  );
};

export default JoinRoom; 