import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

// Import components
import PlayerSeat from '../components/PlayerSeat';
import DealerArea from '../components/DealerArea';
import PlayerControls from '../components/PlayerControls';
import BettingPanel from '../components/BettingPanel';
import Chat from '../components/Chat';
import GameHistory from '../components/GameHistory';

const GameRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #0a2219 50%, #000000 100%);
  color: white;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const GameHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: linear-gradient(180deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #d4af37;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const RoomTitle = styled.h1`
  font-size: 24px;
  color: #d4af37;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
`;

const RoomCode = styled.div`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(10, 34, 25, 0.8) 100%);
  border: 2px solid rgba(212, 175, 55, 0.5);
  color: #d4af37;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
`;

const PlayerCount = styled.div`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  
  svg {
    margin-right: 5px;
    color: #d4af37;
  }
`;

const LeaveButton = styled.button`
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(211, 47, 47, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(211, 47, 47, 0.6);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const GameContent = styled.div`
  display: flex;
  height: calc(100vh - 66px); // Subtract header height
`;

const GameTable = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
  overflow: hidden;
`;

const DealerSection = styled.div`
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const PlayersSection = styled.div`
  height: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

const ControlsSection = styled.div`
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 20px;
`;

const SidebarContainer = styled.div`
  width: 350px;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border-left: 2px solid rgba(212, 175, 55, 0.5);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 5;
`;

const StartGameButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  border: none;
  padding: 18px 40px;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
  text-transform: uppercase;
  letter-spacing: 2px;
  z-index: 20;
  
  &:hover {
    background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
    transform: translate(-50%, -52%);
    box-shadow: 0 12px 40px rgba(212, 175, 55, 0.6);
  }
  
  &:active {
    transform: translate(-50%, -50%);
  }
`;

const WaitingMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #d4af37;
  z-index: 15;
  
  h2 {
    font-size: 32px;
    margin-bottom: 15px;
    font-weight: 700;
    text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  p {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.8);
    max-width: 400px;
    font-weight: 300;
  }
`;

const ErrorMessage = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(211, 47, 47, 0.95) 0%, rgba(183, 28, 28, 0.95) 100%);
  color: white;
  padding: 14px 24px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(211, 47, 47, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-weight: 600;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ToggleButton = styled.button`
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)' 
    : 'linear-gradient(135deg, rgba(244, 67, 54, 0.8) 0%, rgba(183, 28, 28, 0.8) 100%)'};
  color: white;
  border: 2px solid ${props => props.$active ? '#4caf50' : 'rgba(244, 67, 54, 0.5)'};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const NewRoundButton = styled(StartGameButton)`
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  font-size: 22px;
  padding: 18px 35px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover {
    background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%);
  }
`;

const ButtonIcon = styled.span`
  font-size: 24px;
`;

// Add new styled components for spectators
const SpectatorsContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  max-width: 200px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 15;
`;

const SpectatorsTitle = styled.div`
  font-size: 14px;
  color: #d4af37;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SpectatorsList = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;

const SpectatorItem = styled.div`
  margin: 4px 0;
  padding: 4px 0;
`;

const BettingStatusContainer = styled.div`
  position: absolute;
  bottom: 600px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 16px;
  padding: 20px 30px;
  z-index: 110;
  text-align: center;
  min-width: 300px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(10px);
`;

const BettingStatusTitle = styled.h2`
  color: #d4af37;
  margin: 0 0 15px 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
`;

const BettingStatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;

const BettingStatusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(212, 175, 55, 0.2);
    border-color: rgba(212, 175, 55, 0.5);
  }
`;

const BettingStatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  ${props => props.$hasBet ? `
    background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
    color: white;
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
  ` : `
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    color: white;
    animation: pulse 1.5s ease-in-out infinite;
    box-shadow: 0 0 15px rgba(255, 152, 0, 0.4);
  `}
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }
`;

const GameRoom = () => {
  const navigate = useNavigate();
  const { 
    connected, roomId, players, dealer, gameState, error,
    startGame, leaveRoom, getCurrentPlayer, isPlayerTurn, currentTurn,
    hintsEnabled, toggleHints, autoSkipNewRound, setAutoSkipNewRound,
    startNewRound, kickPlayer, socket
  } = useGame();
  
  // Debug: Log when players array changes
  useEffect(() => {
    if (gameState === 'betting') {
      console.log('🔄 [GameRoom] Players array updated:', players.map(p => ({
        username: p.username,
        bet: p.bet,
        balance: p.balance,
        status: p.status,
        id: p.id
      })));
      console.log('🔄 [GameRoom] Players with bets:', players.filter(p => p.bet > 0).map(p => ({
        username: p.username,
        bet: p.bet
      })));
    }
  }, [players, gameState]);
  
  // Redirect if not connected or no room joined
  useEffect(() => {
    if (connected && !roomId) {
      navigate('/');
    }
  }, [connected, roomId, navigate]);
  
  // Current player
  const currentPlayer = getCurrentPlayer();
  
  // Handler for leaving room
  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };
  
  // Check if user is the host (first player)
  // Use socket.id directly from context to ensure accurate comparison
  const isHost = players.length > 0 && socket?.id === players[0]?.id;
  
  // Debug log for host status
  if (isHost) {
    console.log(`Host status: balance=${currentPlayer?.balance}, status=${currentPlayer?.status}, spectating=${currentPlayer?.status === 'spectating' || (gameState === 'betting' && currentPlayer?.balance <= 0)}`);
  }
  
  // Handler for auto-skip toggle
  const handleAutoSkipToggle = () => {
    setAutoSkipNewRound(!autoSkipNewRound);
  };
  
  // Handle kick player (used by PlayerSeat component)
  const handleKickPlayer = (playerId) => {
    if (!roomId) {
      console.error('❌ No roomId available!');
      alert('Error: No room ID found. Please refresh the page.');
      return;
    }
    
    kickPlayer(playerId);
  };
  
  // Get betting status for all players
  const getBettingStatus = () => {
    if (gameState !== 'betting') return null;
    
    const activePlayers = players.filter(p => 
      p.balance > 0 && p.status !== 'spectating' && !p.id.includes('-split')
    );
    
    const playersWithBets = activePlayers.filter(p => p.bet > 0);
    const playersWithoutBets = activePlayers.filter(p => p.bet === 0 || !p.bet);
    
    // Debug logging
    console.log('📊 [getBettingStatus] Current status:', {
      total: activePlayers.length,
      withBets: playersWithBets.length,
      withoutBets: playersWithoutBets.length,
      players: activePlayers.map(p => ({
        username: p.username,
        bet: p.bet,
        hasBet: p.bet > 0,
        balance: p.balance,
        status: p.status
      })),
      allPlayersRaw: players.map(p => ({
        username: p.username,
        bet: p.bet,
        balance: p.balance,
        status: p.status,
        id: p.id
      }))
    });
    
    return {
      total: activePlayers.length,
      withBets: playersWithBets.length,
      withoutBets: playersWithoutBets.length,
      players: activePlayers.map(p => ({
        username: p.username,
        hasBet: (p.bet > 0),
        bet: p.bet || 0
      }))
    };
  };
  
  // Render player seats based on number of players
  const renderPlayerSeats = () => {
    // Filter out spectators (including the host if they're spectating)
    const activePlayers = players.filter(player => {
      // During betting phase, filter out players with zero balance
      if (gameState === 'betting' && player.balance <= 0) return false;
      
      // Filter out players with spectating status
      return player.status !== 'spectating';
    });
    
    console.log('Active players:', activePlayers.map(p => `${p.username} (status: ${p.status}, balance: ${p.balance}, isHost: ${p.id === players[0]?.id})`));
    console.log('Spectators:', getSpectators().map(p => `${p.username} (isHost: ${p.id === players[0]?.id})`));
    
    return activePlayers.map((player, index) => {
      // Check if this is the current player or a split hand of the current player
      const isMainPlayer = player.id === currentPlayer?.id;
      const isSplitHandOfCurrentPlayer = player.originalPlayer === currentPlayer?.id;
      const isThisCurrentPlayer = isMainPlayer || isSplitHandOfCurrentPlayer;
      
      return (
        <PlayerSeat 
          key={player.id}
          player={player}
          isCurrentPlayer={isThisCurrentPlayer}
          isPlayerTurn={player.id === currentTurn}
          position={index}
          gameState={gameState}
          isHost={isHost}
          onKick={handleKickPlayer}
        />
      );
    });
  };
  
  // Add a function to get spectators
  const getSpectators = () => {
    // Get players who are either marked as spectating or have zero balance during betting phase
    const spectators = players.filter(player => {
      // Include players with spectating status
      if (player.status === 'spectating') return true;
      
      // During betting phase, also include players with zero balance
      if (gameState === 'betting' && player.balance <= 0) return true;
      
      return false;
    });
    
    // Debug log for spectators
    console.log('Spectators list:', spectators.map(p => `${p.username} (isHost: ${p.id === players[0]?.id}, balance: ${p.balance}, status: ${p.status})`));
    
    return spectators;
  };
  
  // Render appropriate controls based on game state
  const renderControls = () => {
    // Get the current player (either main hand or split hand based on whose turn it is)
    const activePlayer = getCurrentPlayer();
    
    // Skip controls if player has blackjack
    const hasBlackjack = activePlayer?.status === 'blackjack';
    
    // Check if player can split (has exactly 2 cards with the same value)
    const canSplit = activePlayer?.cards?.length === 2 && 
      activePlayer.cards[0].value === activePlayer.cards[1].value &&
      activePlayer.balance >= activePlayer.bet &&
      !activePlayer.id.includes('-split'); // Can't split a split hand
    
    if (gameState === 'betting') {
      // Don't show betting panel for players with zero balance or spectating status
      if (currentPlayer?.balance <= 0 || currentPlayer?.status === 'spectating') {
        return (
          <div style={{ 
            textAlign: 'center', 
            padding: '15px', 
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '10px',
            color: '#e2b714'
          }}>
            You are out of funds and will spectate this round
          </div>
        );
      }
      
      const handleBetComplete = () => {
        // This is a placeholder function that will be called when a bet is placed
        console.log('Bet placed successfully');
      };
      
      return <BettingPanel 
        onBetComplete={handleBetComplete} 
        playerBalance={currentPlayer?.balance || 0} 
      />;
    } else if (gameState === 'playing' && isPlayerTurn() && !hasBlackjack) {
      return <PlayerControls currentPlayer={activePlayer} canSplit={canSplit} />;
    } else if (gameState === 'ended' && isHost && currentPlayer?.balance > 0 && currentPlayer?.status !== 'spectating') {
      return <NewRoundButton onClick={startNewRound}>
        <ButtonIcon>🔄</ButtonIcon>
        Start New Round
      </NewRoundButton>;
    }
    
    // If it's not the player's turn or they have blackjack, don't show controls
    return null;
  };
  
  return (
    <GameRoomContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <GameHeader>
        <RoomInfo>
          <RoomTitle>Blackjack Table</RoomTitle>
          {roomId && <RoomCode>Room: {roomId}</RoomCode>}
          <PlayerCount>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,21H8A1,1 0 0,1 7,20V12.07L5.7,13.07C5.31,13.46 4.68,13.46 4.29,13.07L1.46,10.29C1.07,9.9 1.07,9.27 1.46,8.88L7.34,3H9C9,4.1 10.34,5 12,5C13.66,5 15,4.1 15,3H16.66L22.54,8.88C22.93,9.27 22.93,9.9 22.54,10.29L19.71,13.12C19.32,13.5 18.69,13.5 18.3,13.12L17,12.12V20A1,1 0 0,1 16,21"></path>
            </svg>
            {players.length} Player{players.length !== 1 ? 's' : ''}
          </PlayerCount>
        </RoomInfo>
        
        <HeaderControls>
          {isHost && (
            <ToggleButton 
              $active={autoSkipNewRound} 
              onClick={handleAutoSkipToggle}
              title={autoSkipNewRound ? "Auto Next Round" : "Manual Next Round"}
            >
              <span role="img" aria-label="auto-next">🔄</span>
              {autoSkipNewRound ? "Auto Next Round: On" : "Auto Next Round: Off"}
            </ToggleButton>
          )}
          
          <ToggleButton 
            $active={hintsEnabled} 
            onClick={toggleHints}
            title={hintsEnabled ? "Disable strategy hints" : "Enable strategy hints"}
          >
            <span role="img" aria-label="hint">💡</span>
            {hintsEnabled ? "Strategy Help: On" : "Strategy Help: Off"}
          </ToggleButton>
          
          <LeaveButton onClick={handleLeaveRoom}>Leave Table</LeaveButton>
        </HeaderControls>
      </GameHeader>
      
      <GameContent>
        <GameTable>
          <DealerSection>
            {(gameState === 'playing' || gameState === 'ended') && (
              <DealerArea dealer={dealer} gameState={gameState} currentTurn={currentTurn} />
            )}
          </DealerSection>
          
          <PlayersSection>
            {renderPlayerSeats()}
          </PlayersSection>
          
          <ControlsSection>
            {renderControls()}
          </ControlsSection>
          
          {gameState === 'waiting' && (
            <>
              {isHost && players.length >= 2 ? (
                <StartGameButton onClick={startGame}>
                  Start Game
                </StartGameButton>
              ) : (
                <WaitingMessage>
                  <h2>Waiting for players...</h2>
                  <p>
                    {isHost 
                      ? 'You need at least one more player to start the game.' 
                      : 'Waiting for the host to start the game.'}
                  </p>
                </WaitingMessage>
              )}
            </>
          )}
          
          {/* Add spectator list */}
          {getSpectators().length > 0 && (
            <SpectatorsContainer>
              <SpectatorsTitle>
                <span role="img" aria-label="spectators">👁️</span> Spectators
              </SpectatorsTitle>
              <SpectatorsList>
                {getSpectators().map(spectator => (
                  <SpectatorItem key={spectator.id}>
                    {spectator.username}
                  </SpectatorItem>
                ))}
              </SpectatorsList>
            </SpectatorsContainer>
          )}
          
          {/* Betting Status Indicator */}
          {gameState === 'betting' && (() => {
            const bettingStatus = getBettingStatus();
            if (!bettingStatus || bettingStatus.total === 0) return null;
            
            return (
              <BettingStatusContainer key={`betting-status-${bettingStatus.withBets}-${bettingStatus.total}`}>
                <BettingStatusTitle>
                  <span role="img" aria-label="betting">💰</span>
                  Betting Phase
                </BettingStatusTitle>
                <div style={{ color: '#e2b714', marginBottom: '10px' }}>
                  {bettingStatus.withBets} of {bettingStatus.total} players have placed bets
                </div>
                <BettingStatusList>
                  {bettingStatus.players.map((player, index) => (
                    <BettingStatusItem key={`${player.username}-${player.hasBet}-${player.bet}`}>
                      <span>{player.username}</span>
                      <BettingStatusBadge $hasBet={player.hasBet}>
                        {player.hasBet ? `✓ Bet: $${player.bet}` : 'Waiting...'}
                      </BettingStatusBadge>
                    </BettingStatusItem>
                  ))}
                </BettingStatusList>
              </BettingStatusContainer>
            );
          })()}
        </GameTable>
        
        <SidebarContainer>
          <Chat />
          <GameHistory />
        </SidebarContainer>
      </GameContent>
    </GameRoomContainer>
  );
};

export default GameRoom; 