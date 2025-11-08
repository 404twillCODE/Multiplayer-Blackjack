import React from 'react';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

const HistoryContainer = styled.div`
  width: 100%;
  max-width: 350px;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(10px);
`;

const HistoryHeader = styled.div`
  padding: 15px;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%);
  font-weight: 700;
  color: #d4af37;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  svg {
    margin-right: 8px;
    font-size: 1.2rem;
    color: #d4af37;
  }
`;

const HistoryList = styled.div`
  max-height: 300px;
  overflow-y: auto;
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

const HistoryItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(212, 175, 55, 0.1);
    border-left: 3px solid #d4af37;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const RoundHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #aaa;
`;

const RoundNumber = styled.div`
  font-weight: 600;
`;

const TimeStamp = styled.div``;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const PlayerResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background-color: ${props => {
    if (props.result === 'win') return 'rgba(76, 175, 80, 0.2)';
    if (props.result === 'lose') return 'rgba(244, 67, 54, 0.2)';
    if (props.result === 'push') return 'rgba(255, 152, 0, 0.2)';
    if (props.result === 'blackjack') return 'rgba(226, 183, 20, 0.2)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  border: 1px solid ${props => {
    if (props.result === 'win') return '#4caf50';
    if (props.result === 'lose') return '#f44336';
    if (props.result === 'push') return '#ff9800';
    if (props.result === 'blackjack') return '#e2b714';
    return '#444';
  }};
`;

const Username = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #f5f5f5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const ResultLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => {
    if (props.result === 'win') return '#4caf50';
    if (props.result === 'lose') return '#f44336';
    if (props.result === 'push') return '#ff9800';
    if (props.result === 'blackjack') return '#e2b714';
    if (props.result === 'bust') return '#f44336';
    return '#f5f5f5';
  }};
`;

const AmountChange = styled.div`
  font-size: 0.85rem;
  color: ${props => {
    if (props.amount > 0) return '#4caf50';
    if (props.amount < 0) return '#f44336';
    return '#f5f5f5';
  }};
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
`;

const AllLostMessage = styled.div`
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(183, 28, 28, 0.2) 100%);
  border: 2px solid rgba(244, 67, 54, 0.5);
  border-radius: 12px;
  margin: 10px 0;
`;

const AllLostIcon = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
`;

const AllLostText = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #f44336;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
`;

const AllLostSubtext = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getResultLabel = (result) => {
  switch (result) {
    case 'win':
      return 'WIN';
    case 'lose':
      return 'LOSE';
    case 'push':
      return 'PUSH';
    case 'blackjack':
      return 'BLACKJACK';
    case 'bust':
      return 'BUST';
    case 'all_lost':
      return 'ALL LOST';
    default:
      return '';
  }
};

const GameHistory = () => {
  const { gameHistory = [] } = useGame();
  
  return (
    <HistoryContainer>
      <HistoryHeader>
        <span>📋</span> Game History
      </HistoryHeader>
      
      <HistoryList>
        {gameHistory && gameHistory.length > 0 ? (
          gameHistory.map((round, index) => (
            <HistoryItem key={index}>
              <RoundHeader>
                <RoundNumber>Round {round.roundNumber || gameHistory.length - index}</RoundNumber>
                <TimeStamp>{formatTime(round.timestamp || Date.now())}</TimeStamp>
              </RoundHeader>
              
              {round.allPlayersLost ? (
                <AllLostMessage>
                  <AllLostIcon>💸</AllLostIcon>
                  <AllLostText>All Players Lost</AllLostText>
                  <AllLostSubtext>Everyone ran out of money!</AllLostSubtext>
                </AllLostMessage>
              ) : (
                <ResultGrid>
                  {round.results && round.results
                    .filter(result => {
                      // Filter out spectating players
                      // Players are spectating if:
                      // 1. They have outcome 'spectating'
                      // 2. They have amountChange === 0 and no meaningful outcome (no bet placed)
                      if (result.outcome === 'spectating') {
                        return false;
                      }
                      if (result.amountChange === 0 && (!result.outcome || result.outcome === '')) {
                        return false; // No bet, no outcome = spectating
                      }
                      return true;
                    })
                    .map((result, playerIndex) => (
                      <PlayerResult 
                        key={playerIndex} 
                        result={result.outcome}
                      >
                        <Username>{result.username}</Username>
                        <ResultLabel result={result.outcome}>
                          {getResultLabel(result.outcome)}
                        </ResultLabel>
                        <AmountChange amount={result.amountChange}>
                          {result.amountChange > 0 ? '+' : ''}{result.amountChange}
                        </AmountChange>
                      </PlayerResult>
                    ))}
                </ResultGrid>
              )}
            </HistoryItem>
          ))
        ) : (
          <EmptyState>No game history yet.</EmptyState>
        )}
      </HistoryList>
    </HistoryContainer>
  );
};

export default GameHistory; 