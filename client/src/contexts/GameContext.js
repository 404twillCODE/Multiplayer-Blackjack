import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { SOCKET_SERVER } from '../config';

export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(1000);
  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [dealer, setDealer] = useState({ cards: [], score: 0 });
  const [gameState, setGameState] = useState('waiting');
  const [currentTurn, setCurrentTurn] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastBet, setLastBet] = useState(0);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [autoSkipNewRound, setAutoSkipNewRound] = useState(true);
  const [isPickingUpCards, setIsPickingUpCards] = useState(false);
  const [showVotePrompt, setShowVotePrompt] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const navigate = useNavigate();

  // Helper function to add messages to the chat
  const addMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // Define startNewRound function before it's used in useEffect
  const startNewRound = useCallback(() => {
    if (!connected || !roomId || !socket) return;
    socket.emit('new_round', { roomId });
  }, [connected, roomId, socket]);

  // Connect to socket server
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
      timeout: 30000,
      forceNew: true,
      upgrade: true,
      rememberUpgrade: false
    });
    
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      setConnected(true);
      setError(null);
    });
    
    newSocket.on('connect_error', (error) => {
      setConnected(false);
      const errorMsg = error.message || 'Connection refused';
      setError(`Failed to connect to server: ${errorMsg}. The server may be sleeping. Try visiting https://multiplayer-blackjack-7df9.onrender.com to wake it up, then refresh this page.`);
    });
    
    newSocket.on('reconnect', () => {
      setConnected(true);
      setError(null);
    });
    
    newSocket.on('reconnect_failed', () => {
      setError('Unable to connect to server. Please check if the server is running and refresh the page.');
    });
    
    newSocket.on('disconnect', (reason) => {
      setConnected(false);
      if (reason === 'io server disconnect') {
        setError('Disconnected by server. Please refresh the page.');
      }
    });
    
    newSocket.on('error', (data) => {
      setError(data.message || 'An error occurred');
      setTimeout(() => setError(null), 5000);
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Handle room events
  useEffect(() => {
    if (!socket) return;
    
    socket.on('room_joined', (data) => {
      if (!data) return;
      setRoomId(data.roomId);
      setPlayers(data.players || []);
      setGameState(data.gameState || 'waiting');
      setError(null);
      
      // Add system message
      const playerNames = data.players ? data.players.map(p => p.username).join(', ') : '';
      addMessage({
        content: `Room joined. Current players: ${playerNames}`,
        type: 'system',
        timestamp: Date.now()
      });

      // Navigate to game room after successful join
      navigate('/game-room');
    });
    
    socket.on('player_joined', (data) => {
      if (!data || !data.players) return;
      setPlayers(data.players);
      
      // Add system message about new player
      const newPlayer = data.players[data.players.length - 1];
      if (newPlayer) {
        addMessage({
          content: `${newPlayer.username} joined the room`,
          type: 'system',
          timestamp: Date.now()
        });
      }
    });
    
    socket.on('player_left', (data) => {
      if (!data) return;
      setPlayers(data.players || []);
      
      // Add system message about player leaving
      if (data.leftPlayer) {
        addMessage({
          content: `${data.leftPlayer} left the room`,
          type: 'system',
          timestamp: Date.now()
        });
      }
    });
    
    socket.on('player_kicked', (data) => {
      if (!data) return;
      setPlayers(data.players || []);
      
      // Add system message about player being kicked
      if (data.kickedPlayer) {
        addMessage({
          content: `${data.kickedPlayer} was kicked from the room`,
          type: 'system',
          timestamp: Date.now()
        });
      }
    });
    
    return () => {
      socket.off('room_joined');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('player_kicked');
    };
  }, [socket, navigate]);
  
  // Handle being kicked from room
  useEffect(() => {
    if (!socket) return;
    
    const handleKicked = (data) => {
      // Current player was kicked
      setError(data.message || 'You have been kicked from the room');
      // Clear room state
      setRoomId(null);
      setPlayers([]);
      setDealer({ cards: [], score: 0 });
      setGameState('waiting');
      setCurrentTurn(null);
      setMessages([]);
      // Navigate to home
      navigate('/');
    };
    
    socket.on('kicked', handleKicked);
    
    return () => {
      socket.off('kicked', handleKicked);
    };
  }, [socket, navigate]);
  
  // Handle game events
  useEffect(() => {
    if (!socket) return;
    
    socket.on('game_started', (data) => {
      if (!data) return;
      setGameState('betting');
      setDealer(data.dealer || { cards: [], score: 0 });
      setPlayers(data.players || []);
      
      addMessage({
        content: 'Game started! Place your bets.',
        type: 'system',
        timestamp: Date.now()
      });
    });
    
    socket.on('betting_ended', (data) => {
      if (!data) return;
      setPlayers(data.players || []);
      setGameState('playing');
      
      addMessage({
        content: 'All bets placed. Game is starting...',
        type: 'system',
        timestamp: Date.now()
      });
    });
    
    socket.on('player_bet_placed', (data) => {
      if (!data) return;
      
      if (data.players && Array.isArray(data.players)) {
        setPlayers([...data.players]);
      }
      
      if (data.playerId === socket.id && data.balance !== undefined) {
        setBalance(data.balance);
      }
    });
    
    socket.on('bet_placed', (data) => {
      if (!data) return;
      // Update balance when current player places bet
      if (data.balance !== undefined) {
        setBalance(data.balance);
      }
    });
    
    socket.on('player_turn', (data) => {
      setCurrentTurn(data.playerId);
      setPlayers(data.players || players);
      
      const player = data.players && data.players.find(p => p.id === data.playerId);
      
      addMessage({
        content: `It's ${player ? player.username : 'unknown player'}'s turn`,
        type: 'system',
        timestamp: Date.now()
      });
    });
    
    // Track the last auto-skip message to prevent duplicates
    let lastAutoSkipKey = null;
    
    const handlePlayerAutoSkipped = (data) => {
      if (!data) return;
      
      // Create a unique key for this auto-skip event
      const skipKey = `${data.playerId}-${data.timestamp || Date.now()}`;
      
      // Prevent duplicate messages
      if (lastAutoSkipKey === skipKey) {
        return;
      }
      
      lastAutoSkipKey = skipKey;
      
      setPlayers(data.players || players);
      setCurrentTurn(null);
      
      const playerName = data.username || (data.players && data.players.find(p => p.id === data.playerId)?.username) || 'A player';
      
      addMessage({
        content: `${playerName} was automatically skipped (30 seconds elapsed)`,
        type: 'system',
        timestamp: Date.now()
      });
    };
    
    socket.on('player_auto_skipped', handlePlayerAutoSkipped);
    
    socket.on('card_dealt', (data) => {
      if (!data) return;
      if (data.to === 'dealer') {
        setDealer(data.dealer || { cards: [], score: 0 });
      } else if (data.to && data.cards) {
        setPlayers(prev => 
          prev.map(player => 
            player.id === data.to ? { ...player, cards: data.cards, score: data.score || 0 } : player
          )
        );
      }
    });
    
    socket.on('turn_ended', (data) => {
      if (!data) return;
      setCurrentTurn(data.nextTurn);
      setPlayers(data.players || []);
    });
    
    socket.on('dealer_turn', () => {
      setCurrentTurn('dealer');
      
      addMessage({
        content: `Dealer's turn`,
        type: 'system',
        timestamp: Date.now()
      });
    });
    
    socket.on('game_reset', (data) => {
      if (!data) return;
      
      setShowVotePrompt(false);
      setVoteStatus(null);
      setHasVoted(false);
      setGameState('waiting');
      setDealer({ cards: [], score: 0 });
      setCurrentTurn(null);
      setPlayers(data.players || []);
      
      const currentPlayer = data.players?.find(p => p.id === socket.id);
      if (currentPlayer) {
        setBalance(currentPlayer.balance);
      }
      
      addMessage({
        content: data.message || 'Game has been reset! Everyone starts with $1000 again.',
        type: 'system',
        timestamp: Date.now()
      });
    });
    
    socket.on('game_ended', (data) => {
      if (!data) return;
      
      // Store the final game data for after animation
      const finalData = data;
      
      // Start the card pickup animation
      setIsPickingUpCards(true);
      
      // Wait for animation to complete before updating state
      // Animation takes ~1.5 seconds (600ms per card + delays)
      setTimeout(() => {
        setGameState('ended');
        setDealer(finalData.dealer || { cards: [], score: 0 });
        setPlayers(finalData.players || []);
        setCurrentTurn(null);
        setIsPickingUpCards(false);
        
        // Update game history
        const historyEntry = {
          id: Date.now(),
          dealer: finalData.dealer,
          players: finalData.players,
          results: finalData.result?.results || [],
          timestamp: Date.now(),
          allPlayersLost: finalData.allPlayersLost || false
        };
        setGameHistory(prev => [historyEntry, ...prev].slice(0, 10));
        
        // Add system message
        let resultMessage = 'Round ended. Check your results!';
        if (finalData.allPlayersLost) {
          resultMessage = 'All players ran out of money!';
        } else if (finalData.result && finalData.result.results) {
          const resultSummary = finalData.result.results
            .map(r => `${r.username}: ${r.outcome} (${r.amountChange >= 0 ? '+' : ''}${r.amountChange})`)
            .join(', ');
          resultMessage = `Round ended. Results: ${resultSummary}`;
        }
        
        addMessage({
          content: resultMessage,
          type: 'system',
          timestamp: Date.now()
        });
        
        // If all players lost, don't auto-start new round (wait for vote)
        if (finalData.allPlayersLost) {
          // Vote prompt will be shown via vote_to_continue event
          return;
        }
        
        // If host has auto-next round enabled, automatically start a new round after animation
        if (autoSkipNewRound && socket.id === players[0]?.id) {
          setTimeout(() => {
            startNewRound();
          }, 500);
        }
      }, 2000); // Wait 2 seconds for all cards to animate
    });
    
    socket.on('vote_to_continue', (data) => {
      if (!data) return;
      setShowVotePrompt(true);
      setHasVoted(false);
      setVoteStatus(null);
      addMessage({
        content: data.message || 'All players ran out of money! Vote to continue or reset.',
        type: 'system',
        timestamp: Date.now()
      });
    });
    
    socket.on('vote_status', (data) => {
      if (!data) return;
      setVoteStatus(data);
    });
    
    socket.on('new_round', (data) => {
      if (!data) return;
      
      setGameState('betting');
      if (data.players && Array.isArray(data.players)) {
        setPlayers(data.players);
      }
      setDealer(data.dealer || { cards: [], score: 0 });
      
      const manualStartMessage = data.isAutoSkip === false ? ' (Manual start by host)' : '';
      addMessage({
        content: `New round started${manualStartMessage}. Place your bets!`,
        type: 'system',
        timestamp: Date.now()
      });
    });
    
    socket.on('message', (data) => {
      addMessage(data);
    });
    
    socket.on('leaderboard_updated', (data) => {
      setLeaderboard(data.leaderboard);
    });
    
    socket.on('player_split', (data) => {
      if (!data) return;
      setPlayers(data.players || []);
      
      addMessage({
        content: `${data.players.find(p => p.id === data.playerId)?.username || 'Player'} split their hand`,
        type: 'system',
        timestamp: Date.now()
      });
    });
    
    // Handle player spectating event
    socket.on('player_spectating', (data) => {
      if (!data) return;
      
      // Update the player's status in the players array
      setPlayers(prev => 
        prev.map(player => 
          player.id === data.playerId 
            ? { ...player, status: 'spectating' } 
            : player
        )
      );
      
      addMessage({
        content: `${data.username} is now spectating the game`,
        type: 'system',
        timestamp: Date.now()
      });
    });
    
    return () => {
      socket.off('game_started');
      socket.off('betting_ended');
      socket.off('player_bet_placed');
      socket.off('bet_placed');
      socket.off('card_dealt');
      socket.off('player_turn');
      socket.off('turn_ended');
      socket.off('dealer_turn');
      socket.off('game_ended');
      socket.off('game_reset');
      socket.off('new_round');
      socket.off('message');
      socket.off('leaderboard_updated');
      socket.off('player_split');
      socket.off('player_spectating');
      socket.off('player_auto_skipped');
      socket.off('vote_to_continue');
      socket.off('vote_status');
    };
  }, [socket, autoSkipNewRound, players, startNewRound]);
  
  // Game actions
  const createRoom = (username, initialBalance = 1000) => {
    if (!connected || !socket) {
      setError('Not connected to server. Please wait a moment and try again.');
      return;
    }
    
    if (!socket.connected) {
      setError('Connection lost. Please refresh the page.');
      return;
    }
    
    setUsername(username);
    setBalance(initialBalance);
    socket.emit('create_room', { username, balance: initialBalance });
  };
  
  const joinRoom = (roomId, username, initialBalance = 1000) => {
    if (!connected) return;
    
    setUsername(username);
    setBalance(initialBalance);
    socket.emit('join_room', { roomId, username, balance: initialBalance });
  };
  
  const startGame = () => {
    if (!connected || !roomId) return;
    
    socket.emit('start_game', { roomId });
  };
  
  const placeBet = (amount) => {
    if (!connected || !roomId) return;
    
    setPlayers(prevPlayers => 
      prevPlayers.map(p => 
        p.id === socket.id 
          ? { ...p, bet: amount, balance: p.balance - amount }
          : p
      )
    );
    
    socket.emit('place_bet', { roomId, amount });
    setLastBet(amount);
  };
  
  const hit = () => {
    if (!connected || !roomId) return;
    
    // For split hands, we need to use the original player's socket ID
    if (currentTurn && currentTurn.includes('-split')) {
      const originalPlayerId = currentTurn.split('-')[0];
      if (originalPlayerId === socket.id) {
        socket.emit('hit', { roomId, handId: currentTurn });
      }
    } else if (currentTurn === socket.id) {
      socket.emit('hit', { roomId });
    }
  };
  
  const stand = () => {
    if (!connected || !roomId) return;
    
    // For split hands, we need to use the original player's socket ID
    if (currentTurn && currentTurn.includes('-split')) {
      const originalPlayerId = currentTurn.split('-')[0];
      if (originalPlayerId === socket.id) {
        socket.emit('stand', { roomId, handId: currentTurn });
      }
    } else if (currentTurn === socket.id) {
      socket.emit('stand', { roomId });
    }
  };
  
  const doubleDown = () => {
    if (!connected || !roomId) return;
    
    // For split hands, we need to use the original player's socket ID
    if (currentTurn && currentTurn.includes('-split')) {
      const originalPlayerId = currentTurn.split('-')[0];
      if (originalPlayerId === socket.id) {
        socket.emit('double_down', { roomId, handId: currentTurn });
      }
    } else if (currentTurn === socket.id) {
      socket.emit('double_down', { roomId });
    }
  };
  
  const split = () => {
    if (!connected || !roomId || currentTurn !== socket.id) return;
    
    // Can't split a split hand
    if (currentTurn.includes('-split')) return;
    
    socket.emit('split', { roomId });
  };
  
  const surrender = () => {
    if (!connected || !roomId) return;
    
    // For split hands, we need to use the original player's socket ID
    if (currentTurn && currentTurn.includes('-split')) {
      const originalPlayerId = currentTurn.split('-')[0];
      if (originalPlayerId === socket.id) {
        socket.emit('surrender', { roomId, handId: currentTurn });
      }
    } else if (currentTurn === socket.id) {
      socket.emit('surrender', { roomId });
    }
  };
  
  const sendMessage = (message) => {
    if (!connected || !roomId) return;
    
    socket.emit('send_message', { roomId, message, sender: username });
  };
  
  const leaveRoom = () => {
    if (!connected || !roomId) return;
    
    socket.emit('leave_room', { roomId });
    setRoomId(null);
    setPlayers([]);
    setDealer({ cards: [], score: 0 });
    setGameState('waiting');
    setCurrentTurn(null);
    setMessages([]);
  };
  
  const kickPlayer = (playerId) => {
    if (!connected || !roomId || !socket || !socket.connected) return;
    socket.emit('kick_player', { roomId, playerId });
  };

  // Restart game - reset all players' balances to 1000
  const restartGame = () => {
    if (!connected || !roomId || !socket || !socket.connected) {
      alert('Error: Not connected or no room ID. Please refresh the page.');
      return;
    }
    
    socket.emit('restart_game', { roomId });
    
    socket.once('error', (error) => {
      if (error?.message) {
        alert(`Error: ${error.message}`);
      }
    });
  };
  
  // Check if it's current player's turn
  const isPlayerTurn = () => {
    if (!socket || !currentTurn) return false;
    
    // Direct match with player's socket ID
    if (currentTurn === socket.id) return true;
    
    // Check if it's the player's split hand turn
    // Split hands have IDs in the format: originalPlayerId-split
    if (currentTurn.includes('-split')) {
      const originalPlayerId = currentTurn.split('-')[0];
      return originalPlayerId === socket.id;
    }
    
    return false;
  };
  
  // Find the current player
  const getCurrentPlayer = () => {
    if (!socket || !players) return null;
    
    // First check for the player's main hand
    const player = players.find(p => p.id === socket.id);
    
    // If it's the player's split hand turn, return that hand instead
    if (currentTurn && currentTurn.includes('-split')) {
      const splitHand = players.find(p => p.id === currentTurn);
      if (splitHand && splitHand.originalPlayer === socket.id) {
        return splitHand;
      }
    }
    
    return player;
  };
  
  // Toggle hints
  const toggleHints = () => {
    setHintsEnabled(prev => !prev);
  };

  return (
    <GameContext.Provider
      value={{
        connected,
        username,
        balance,
        roomId,
        players,
        dealer,
        gameState,
        currentTurn,
        messages,
        error,
        gameHistory,
        leaderboard,
        lastBet,
        hintsEnabled,
        autoSkipNewRound,
        createRoom,
        joinRoom,
        startGame,
        placeBet,
        hit,
        stand,
        doubleDown,
        split,
        surrender,
        startNewRound,
        sendMessage,
        leaveRoom,
        kickPlayer,
        restartGame,
        isPlayerTurn,
        getCurrentPlayer,
        toggleHints,
        setAutoSkipNewRound,
        socket,
        isPickingUpCards,
        showVotePrompt,
        voteStatus,
        hasVoted,
        voteReset: (vote) => {
          if (!socket || !roomId) return;
          socket.emit('vote_reset', { roomId, vote });
          setHasVoted(true);
        }
      }}
    >
      {children}
    </GameContext.Provider>
  );
}; 