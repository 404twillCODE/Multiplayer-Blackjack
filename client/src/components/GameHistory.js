import React from 'react';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

const HistoryContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border-left: 2px solid rgba(212, 175, 55, 0.3);
  overflow: hidden;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
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
  flex: 1;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlayerSection = styled.div`
  padding: 14px;
  background: rgba(10, 34, 25, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  margin-bottom: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(10, 34, 25, 0.7);
    border-color: rgba(212, 175, 55, 0.5);
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

const PlayerName = styled.div`
  font-weight: 700;
  color: #d4af37;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PlayerInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ScoreDisplay = styled.div`
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 8px;
  color: #d4af37;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
`;

const PlayerResultBadge = styled.div`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => {
    if (props.result === 'win') return 'rgba(76, 175, 80, 0.3)';
    if (props.result === 'lose') return 'rgba(244, 67, 54, 0.3)';
    if (props.result === 'push') return 'rgba(255, 152, 0, 0.3)';
    if (props.result === 'blackjack') return 'rgba(226, 183, 20, 0.3)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => {
    if (props.result === 'win') return '#4caf50';
    if (props.result === 'lose') return '#f44336';
    if (props.result === 'push') return '#ff9800';
    if (props.result === 'blackjack') return '#e2b714';
    return '#f5f5f5';
  }};
  border: 1px solid ${props => {
    if (props.result === 'win') return '#4caf50';
    if (props.result === 'lose') return '#f44336';
    if (props.result === 'push') return '#ff9800';
    if (props.result === 'blackjack') return '#e2b714';
    return '#444';
  }};
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const HistoryCard = styled.div`
  position: relative;
  width: 40px;
  height: 60px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background-color: white;
  color: ${props => props.$color === 'red' ? '#D32F2F' : '#212121'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px;
  font-size: 0.7rem;
  font-weight: 700;
`;

const CardValueSmall = styled.div`
  font-size: 0.7rem;
  line-height: 1;
`;

const CardSuitSmall = styled.div`
  font-size: 0.7rem;
  line-height: 1;
`;

const CardCenterSmall = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
`;

const DealerSection = styled.div`
  padding: 14px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%);
  border-radius: 10px;
  border: 2px solid rgba(212, 175, 55, 0.4);
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
`;

const DealerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

const DealerLabel = styled.div`
  font-weight: 700;
  color: #d4af37;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DealerScore = styled.div`
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%);
  border: 1px solid rgba(212, 175, 55, 0.5);
  border-radius: 8px;
  color: #d4af37;
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
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

// Helper functions for card display
const getSuitSymbol = (suit) => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
    default: return '';
  }
};

const getCardColor = (suit) => {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
};

const getCardValue = (value) => {
  if (value === 'ace') return 'A';
  if (value === 'jack') return 'J';
  if (value === 'queen') return 'Q';
  if (value === 'king') return 'K';
  return value;
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
                  {/* Dealer Section */}
                  {round.dealer && round.dealer.cards && round.dealer.cards.length > 0 && (
                    <DealerSection>
                      <DealerHeader>
                        <DealerLabel>Dealer</DealerLabel>
                        {round.dealer.score > 0 && (
                          <DealerScore>Score: {round.dealer.score}</DealerScore>
                        )}
                      </DealerHeader>
                      <CardsContainer>
                        {round.dealer.cards.map((card, idx) => (
                          <HistoryCard 
                            key={idx}
                            $color={getCardColor(card.suit)}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                              <CardValueSmall>{getCardValue(card.value)}</CardValueSmall>
                              <CardSuitSmall>{getSuitSymbol(card.suit)}</CardSuitSmall>
                            </div>
                            <CardCenterSmall>{getSuitSymbol(card.suit)}</CardCenterSmall>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', transform: 'rotate(180deg)' }}>
                              <CardValueSmall>{getCardValue(card.value)}</CardValueSmall>
                              <CardSuitSmall>{getSuitSymbol(card.suit)}</CardSuitSmall>
                            </div>
                          </HistoryCard>
                        ))}
                      </CardsContainer>
                    </DealerSection>
                  )}
                  
                  {/* Players Section */}
                  {round.results && round.results
                    .filter(result => {
                      // Filter out spectating players
                      if (result.outcome === 'spectating') {
                        return false;
                      }
                      if (result.amountChange === 0 && (!result.outcome || result.outcome === '')) {
                        return false; // No bet, no outcome = spectating
                      }
                      return true;
                    })
                    .map((result, playerIndex) => (
                      <PlayerSection key={playerIndex}>
                        <PlayerHeader>
                          <PlayerName>{result.username}</PlayerName>
                          <PlayerInfoRow>
                            {result.score > 0 && (
                              <ScoreDisplay>
                                Score: {result.score}
                              </ScoreDisplay>
                            )}
                            <PlayerResultBadge result={result.outcome}>
                              {getResultLabel(result.outcome)}
                            </PlayerResultBadge>
                            <div style={{ 
                              padding: '6px 12px',
                              background: result.amountChange > 0 
                                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)'
                                : result.amountChange < 0
                                ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                              border: `1px solid ${result.amountChange > 0 ? '#4caf50' : result.amountChange < 0 ? '#f44336' : 'rgba(255, 255, 255, 0.2)'}`,
                              borderRadius: '8px',
                              color: result.amountChange > 0 ? '#4caf50' : result.amountChange < 0 ? '#f44336' : '#f5f5f5',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              whiteSpace: 'nowrap'
                            }}>
                              {result.amountChange > 0 ? '+' : ''}{result.amountChange}
                            </div>
                          </PlayerInfoRow>
                        </PlayerHeader>
                        {result.cards && result.cards.length > 0 ? (
                          <CardsContainer>
                            {result.cards.map((card, idx) => (
                              <HistoryCard 
                                key={idx}
                                $color={getCardColor(card.suit)}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                  <CardValueSmall>{getCardValue(card.value)}</CardValueSmall>
                                  <CardSuitSmall>{getSuitSymbol(card.suit)}</CardSuitSmall>
                                </div>
                                <CardCenterSmall>{getSuitSymbol(card.suit)}</CardCenterSmall>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', transform: 'rotate(180deg)' }}>
                                  <CardValueSmall>{getCardValue(card.value)}</CardValueSmall>
                                  <CardSuitSmall>{getSuitSymbol(card.suit)}</CardSuitSmall>
                                </div>
                              </HistoryCard>
                            ))}
                          </CardsContainer>
                        ) : (
                          <div style={{ 
                            padding: '8px', 
                            color: 'rgba(255, 255, 255, 0.5)', 
                            fontStyle: 'italic',
                            fontSize: '0.85rem'
                          }}>
                            No cards
                          </div>
                        )}
                      </PlayerSection>
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