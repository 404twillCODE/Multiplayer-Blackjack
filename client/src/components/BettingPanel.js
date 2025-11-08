import React, { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

const BettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(212, 175, 55, 0.5);
  padding: 2rem;
  border-radius: 16px;
  position: absolute;
  z-index: 100;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(10px);
  width: 380px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100px;
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  color: #d4af37;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
`;

const CustomBetContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
  width: 80%;
`;

const CustomBetInput = styled.input`
  padding: 0.7rem;
  border-radius: 8px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  background-color: rgba(10, 34, 25, 0.8);
  color: white;
  font-size: 0.9rem;
  width: 65%;
  text-align: center;
  font-weight: 600;
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

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
`;

const ApplyCustomBetButton = styled(Button)`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.8) 0%, rgba(244, 208, 63, 0.8) 100%);
  color: #0a2219;
  border: 2px solid rgba(212, 175, 55, 0.5);
  padding: 0.6rem;
  width: 35%;
  font-size: 0.85rem;
  font-weight: 700;
  
  &:hover {
    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  }
`;

const ChipsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Chip = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
  
  ${props => props.selected && `
    border: 3px solid #d4af37;
    transform: translateY(-5px) scale(1.15);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
  `}
  
  ${props => props.disabled && `
    opacity: 0.4;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
  `}
`;

const RedChip = styled(Chip)`
  background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(229, 57, 53, 0.4);
`;

const BlueChip = styled(Chip)`
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);
`;

const GreenChip = styled(Chip)`
  background: linear-gradient(135deg, #388e3c 0%, #2e7d32 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(56, 142, 60, 0.4);
`;

const YellowChip = styled(Chip)`
  background: linear-gradient(135deg, #673ab7 0%, #5e35b1 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(103, 58, 183, 0.4);
`;

const BlackChip = styled(Chip)`
  background: linear-gradient(135deg, #424242 0%, #212121 100%);
  color: #d4af37;
  border: 2px solid rgba(212, 175, 55, 0.6);
  box-shadow: 0 4px 15px rgba(66, 66, 66, 0.5);
`;

const GoldChip = styled(Chip)`
  background: linear-gradient(135deg, #ffd700 0%, #ffc107 100%);
  color: #1a1a1a;
  font-size: 0.85rem;
  border: 2px solid rgba(255, 215, 0, 0.8);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
`;

const BetDisplay = styled.div`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #d4af37;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PlaceBetButton = styled(Button)`
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #43a047 0%, #4caf50 100%);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
  }
`;

const ClearButton = styled(Button)`
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.6);
  }
`;

const RepeatBetButton = styled(Button)`
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
`;

const BettingPanel = ({ onBetComplete, playerBalance }) => {
  const { placeBet, lastBet } = useGame();
  const [currentBet, setCurrentBet] = useState(0);
  const [selectedChip, setSelectedChip] = useState(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [customBetValue, setCustomBetValue] = useState('');
  
  const handleChipClick = (value) => {
    if (playerBalance < value || playerBalance < currentBet + value) return;
    
    setCurrentBet(prev => prev + value);
    setSelectedChip(value);
  };
  
  const handleClearBet = () => {
    setCurrentBet(0);
    setSelectedChip(null);
  };
  
  const handlePlaceBet = () => {
    if (currentBet <= 0) return;
    
    placeBet(currentBet);
    setBetPlaced(true);
    
    if (onBetComplete && typeof onBetComplete === 'function') {
      onBetComplete();
    }
  };

  const handleRepeatBet = () => {
    if (lastBet <= 0 || lastBet > playerBalance) return;
    
    setCurrentBet(lastBet);
    placeBet(lastBet);
    setBetPlaced(true);
    
    if (onBetComplete && typeof onBetComplete === 'function') {
      onBetComplete();
    }
  };
  
  const handleCustomBetChange = (e) => {
    // Allow numbers and one decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Ensure only two decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return;
    }
    
    setCustomBetValue(value);
  };
  
  const handleApplyCustomBet = () => {
    const betValue = parseFloat(customBetValue);
    if (isNaN(betValue) || betValue <= 0 || betValue > playerBalance) return;
    
    // Round to 2 decimal places to avoid floating point issues
    const roundedBet = Math.round(betValue * 100) / 100;
    setCurrentBet(roundedBet);
    setSelectedChip(null);
    setCustomBetValue('');
  };
  
  const handleCustomBetKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyCustomBet();
    }
  };
  
  const isChipDisabled = (value) => {
    return playerBalance < value || playerBalance < currentBet + value;
  };
  
  // If bet has been placed, show waiting message instead of hiding
  if (betPlaced) {
    return (
      <BettingContainer>
        <Title style={{ color: '#4caf50' }}>✓ Bet Placed!</Title>
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#e2b714',
          fontSize: '1.1rem'
        }}>
          Waiting for other players to place their bets...
        </div>
      </BettingContainer>
    );
  }
  
  return (
    <BettingContainer>
      <Title>Place Your Bet</Title>
      
      <CustomBetContainer>
        <CustomBetInput 
          type="text" 
          placeholder="Custom Bet" 
          value={customBetValue}
          onChange={handleCustomBetChange}
          onKeyPress={handleCustomBetKeyPress}
        />
        <ApplyCustomBetButton onClick={handleApplyCustomBet}>Apply</ApplyCustomBetButton>
      </CustomBetContainer>
      
      <ChipsContainer>
        <RedChip 
          onClick={() => handleChipClick(5)}
          selected={selectedChip === 5}
          disabled={isChipDisabled(5)}
        >
          $5
        </RedChip>
        <BlueChip 
          onClick={() => handleChipClick(10)}
          selected={selectedChip === 10}
          disabled={isChipDisabled(10)}
        >
          $10
        </BlueChip>
        <GreenChip 
          onClick={() => handleChipClick(25)}
          selected={selectedChip === 25}
          disabled={isChipDisabled(25)}
        >
          $25
        </GreenChip>
        <YellowChip 
          onClick={() => handleChipClick(50)}
          selected={selectedChip === 50}
          disabled={isChipDisabled(50)}
        >
          $50
        </YellowChip>
        <BlackChip 
          onClick={() => handleChipClick(100)}
          selected={selectedChip === 100}
          disabled={isChipDisabled(100)}
        >
          $100
        </BlackChip>
        <GoldChip 
          onClick={() => handleChipClick(playerBalance)}
          selected={currentBet === playerBalance}
          disabled={playerBalance <= 0}
        >
          ALL IN
        </GoldChip>
      </ChipsContainer>
      
      <BetDisplay>
        ${currentBet}
      </BetDisplay>
      
      <ButtonsContainer>
        <ClearButton onClick={handleClearBet} disabled={currentBet === 0}>
          Clear
        </ClearButton>
        <PlaceBetButton 
          onClick={handlePlaceBet} 
          disabled={currentBet === 0}
        >
          Place Bet
        </PlaceBetButton>
        {lastBet > 0 && (
          <RepeatBetButton 
            onClick={handleRepeatBet} 
            disabled={lastBet > playerBalance}
          >
            Repeat ${lastBet}
          </RepeatBetButton>
        )}
      </ButtonsContainer>
    </BettingContainer>
  );
};

export default BettingPanel; 