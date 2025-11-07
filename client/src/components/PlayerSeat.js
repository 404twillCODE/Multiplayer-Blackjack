import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import Card from './Card';

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.3),
                0 0 20px rgba(76, 175, 80, 0.2);
  }
  50% {
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.4),
                0 0 25px rgba(76, 175, 80, 0.3);
  }
`;

const borderGlow = keyframes`
  0%, 100% {
    border-color: rgba(76, 175, 80, 0.5);
  }
  50% {
    border-color: rgba(76, 175, 80, 0.7);
  }
`;

const SeatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  position: relative;
  margin: 0 15px 20px;
  padding: 15px;
  border-radius: 20px;
  border: ${props => props.$isPlayerTurn 
    ? '2px solid rgba(76, 175, 80, 0.5)' 
    : '2px solid transparent'};
  transition: all 0.3s ease;
  ${props => props.$isPlayerTurn && css`
    animation: ${glow} 3s ease-in-out infinite, ${borderGlow} 3s ease-in-out infinite;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(10, 34, 25, 0.2) 100%);
  `}
`;

const UsernameDisplay = styled.div`
  font-size: 1rem;
  font-weight: 700;
  padding: 8px 16px;
  margin-bottom: 8px;
  background: ${props => props.$isCurrentPlayer 
    ? 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)' 
    : 'linear-gradient(135deg, rgba(10, 34, 25, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%)'};
  color: white;
  border: 2px solid ${props => props.$isCurrentPlayer ? '#4caf50' : 'rgba(212, 175, 55, 0.5)'};
  border-radius: 20px;
  text-align: center;
  min-width: 100px;
  z-index: 5;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const BalanceDisplay = styled.div`
  font-size: 0.9rem;
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(10, 34, 25, 0.8) 100%);
  border: 2px solid rgba(212, 175, 55, 0.5);
  color: #d4af37;
  border-radius: 8px;
  margin-bottom: 10px;
  z-index: 5;
  font-weight: 700;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
`;

const CardArea = styled.div`
  display: flex;
  justify-content: center;
  min-height: 130px;
  margin-bottom: 10px;
  position: relative;
`;

const BetCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(67, 160, 71, 0.3) 100%)' 
    : 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(10, 34, 25, 0.3) 100%)'};
  border: 2px solid ${props => props.$active ? '#4caf50' : 'rgba(212, 175, 55, 0.5)'};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 10px;
  z-index: 1;
  box-shadow: ${props => props.$active 
    ? '0 0 20px rgba(76, 175, 80, 0.5)' 
    : '0 0 10px rgba(212, 175, 55, 0.3)'};
`;

const BetAmount = styled.div`
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
  position: absolute;
  top: -15px;
  z-index: 6;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ScoreChip = styled.div`
  position: absolute;
  top: 45px;
  right: -15px;
  background: ${props => props.$score > 21 
    ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' 
    : props.$score === 21 
    ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' 
    : 'linear-gradient(135deg, rgba(10, 34, 25, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%)'};
  color: ${props => props.$score > 21 ? 'white' : props.$score === 21 ? '#0a2219' : '#d4af37'};
  border: 2px solid ${props => props.$score > 21 ? '#f44336' : props.$score === 21 ? '#d4af37' : 'rgba(212, 175, 55, 0.5)'};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 95px;
  right: 20px;
  background-color: ${props => {
    if (props.$status === 'busted') return '#f44336';
    if (props.$status === 'blackjack') return '#e2b714';
    if (props.$status === 'stood') return '#2196f3';
    if (props.$status === 'surrendered') return '#757575';
    return 'transparent';
  }};
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  z-index: 10;
`;

const getStatusLabel = (status) => {
  switch (status) {
    case 'busted':
      return 'Busted!';
    case 'blackjack':
      return 'Blackjack!';
    case 'stood':
      return 'Stand';
    case 'surrendered':
      return 'Fold';
    case 'spectating':
      return 'Spectating';
    default:
      return '';
  }
};

const KickButton = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 30;
  opacity: 0;
  
  &:hover {
    background-color: #b71c1c;
    transform: scale(1.1);
  }
`;

const PlayerSeat = ({ 
  player, 
  isCurrentPlayer, 
  isPlayerTurn,
  gameState,
  isHost,
  onKick
}) => {
  if (!player) return <SeatContainer />;
  
  const { username, balance, cards, bet, status, score } = player;
  
  // Check if this is a split hand belonging to the current player
  const isSplitHandOfCurrentPlayer = player.id.includes('-split') && isCurrentPlayer;
  
  // Show kick button only if:
  // - User is host
  // - Not kicking themselves
  // - Game is in waiting state
  // - Not a split hand
  const showKickButton = isHost && 
                         !isCurrentPlayer && 
                         gameState === 'waiting' && 
                         !player.id.includes('-split') &&
                         onKick;
  
  const handleKick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to kick ${username}?`)) {
      onKick(player.id);
    }
  };
  
  return (
    <SeatContainer 
      $isPlayerTurn={isPlayerTurn}
      onMouseEnter={(e) => {
        if (showKickButton) {
          e.currentTarget.querySelector('button')?.style.setProperty('opacity', '1');
        }
      }}
      onMouseLeave={(e) => {
        if (showKickButton) {
          e.currentTarget.querySelector('button')?.style.setProperty('opacity', '0');
        }
      }}
    >
      {showKickButton && (
        <KickButton onClick={handleKick} title={`Kick ${username}`}>
          ✕
        </KickButton>
      )}
      
      
      <UsernameDisplay $isCurrentPlayer={isCurrentPlayer || isSplitHandOfCurrentPlayer}>
        {username}
      </UsernameDisplay>
      
      <BalanceDisplay>
        ${balance.toLocaleString()}
      </BalanceDisplay>
      
      <CardArea>
        {cards && cards.map((card, index) => {
          // Check if this is the newest card (last card in array)
          const isNewCard = index === cards.length - 1;
          return <Card key={`${card.suit}-${card.value}-${index}`} card={card} isNewCard={isNewCard} />;
        })}
      </CardArea>
      
      {score > 0 && <ScoreChip $score={score}>{score}</ScoreChip>}
      
      {status && <StatusBadge $status={status}>
        {getStatusLabel(status)}
      </StatusBadge>}
      
      <BetCircle $active={bet > 0}>
        {bet > 0 && <BetAmount>${bet}</BetAmount>}
      </BetCircle>
    </SeatContainer>
  );
};

export default PlayerSeat; 