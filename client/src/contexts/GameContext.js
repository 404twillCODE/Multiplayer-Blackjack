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
  const navigate = useNavigate();

  // Helper function to add messages to the chat
  const addMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // Define startNewRound function before it's used in useEffect
  const startNewRound = useCallback(() => {
    if (!connected) {
      console.error("Cannot start new round: Not connected to server");
      return;
    }
    
    if (!roomId) {
      console.error("Cannot start new round: No room ID");
      return;
    }
    
    if (!socket) {
      console.error("Cannot start new round: Socket not initialized");
      return;
    }
    
    console.log(`Emitting new_round event for room ${roomId}`);
    socket.emit('new_round', { roomId });
  }, [connected, roomId, socket]);

  // Connect to socket server
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER);
    
    newSocket.on('connect', () => {
      setSocket(newSocket);
      setConnected(true);
      console.log('Connected to server');
    });
    
    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });
    
    newSocket.on('error', (data) => {
      console.error('Socket error event:', data);
      setError(data.message);
      setTimeout(() => setError(null), 5000);
    });
    
    // Listen for all socket events for debugging
    newSocket.onAny((eventName, ...args) => {
      if (eventName === 'kick_player' || eventName === 'error' || eventName.includes('kick')) {
        console.log('Socket event received:', eventName, args);
      }
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
      console.log('💰 [player_bet_placed] Received bet update:', {
        playerId: data.playerId,
        username: data.username,
        bet: data.bet,
        playersCount: data.players?.length,
        allPlayers: data.players?.map(p => ({ username: p.username, bet: p.bet, balance: p.balance }))
      });
      
      // Update players array with the new bet information
      if (data.players && Array.isArray(data.players)) {
        console.log('💰 [player_bet_placed] Setting players array to:', data.players.map(p => ({
          username: p.username,
          bet: p.bet,
          balance: p.balance
        })));
        setPlayers([...data.players]); // Create new array to ensure React detects change
      }
      
      // Update balance if it's the current player
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
        console.log('[Client] Duplicate auto-skip message ignored');
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
      console.log(`[Client] Received card_dealt event at ${Date.now()}`, data);
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
      console.log('🎮🎮🎮 GAME_RESET EVENT RECEIVED 🎮🎮🎮');
      console.log('Game reset data:', data);
      
      if (!data) {
        console.error('❌ No data in game_reset event');
        return;
      }
      
      console.log('Setting game state to waiting...');
      setGameState('waiting');
      setDealer({ cards: [], score: 0 });
      setCurrentTurn(null);
      
      console.log('Updating players:', data.players);
      setPlayers(data.players || []);
      
      // Update balance for current player
      const currentPlayer = data.players?.find(p => p.id === socket.id);
      console.log('Current player in reset data:', currentPlayer);
      if (currentPlayer) {
        console.log(`Updating balance: ${currentPlayer.balance}`);
        setBalance(currentPlayer.balance);
      } else {
        console.warn('⚠️ Current player not found in reset data');
      }
      
      // Add system message
      addMessage({
        content: data.message || 'Game has been reset! Everyone starts with $1000 again.',
        type: 'system',
        timestamp: Date.now()
      });
      
      console.log('✅ Game reset complete!');
    });
    
    socket.on('game_ended', (data) => {
      if (!data) return;
      setGameState('ended');
      setDealer(data.dealer || { cards: [], score: 0 });
      setPlayers(data.players || []);
      setCurrentTurn(null);
      
      // Update game history
      const historyEntry = {
        id: Date.now(),
        dealer: data.dealer,
        players: data.players,
        results: data.result?.results || [],
        timestamp: Date.now()
      };
      setGameHistory(prev => [historyEntry, ...prev].slice(0, 10));
      
      // Add system message
      let resultMessage = 'Round ended. Check your results!';
      if (data.result && data.result.results) {
        const resultSummary = data.result.results
          .map(r => `${r.username}: ${r.outcome} (${r.amountChange >= 0 ? '+' : ''}${r.amountChange})`)
          .join(', ');
        resultMessage = `Round ended. Results: ${resultSummary}`;
      }
      
      addMessage({
        content: resultMessage,
        type: 'system',
        timestamp: Date.now()
      });
      
      // If host has auto-next round enabled, automatically start a new round immediately
      if (autoSkipNewRound && socket.id === players[0]?.id) {
        console.log("Auto next round enabled, starting new round immediately");
        console.log("Current socket ID:", socket.id);
        console.log("Host ID (players[0].id):", players[0]?.id);
        console.log("autoSkipNewRound value:", autoSkipNewRound);
        startNewRound();
      } else {
        console.log("Auto next round not triggered because:");
        console.log("- autoSkipNewRound:", autoSkipNewRound);
        console.log("- Is current player the host:", socket.id === players[0]?.id);
        console.log("- Current socket ID:", socket.id);
        console.log("- Host ID (players[0].id):", players[0]?.id);
      }
    });
    
    socket.on('new_round', (data) => {
      if (!data) return;
      console.log('🔄 [new_round] Received new round event:', {
        playersCount: data.players?.length,
        players: data.players?.map(p => ({ username: p.username, bet: p.bet, balance: p.balance }))
      });
      
      setGameState('betting');
      // Update players array - bets should be 0 at start of new round
      if (data.players && Array.isArray(data.players)) {
        setPlayers(data.players);
      }
      setDealer(data.dealer || { cards: [], score: 0 });
      
      // Add system message
      // Only mention manual start if auto-skip is disabled
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
      
      console.log(`Player ${data.username} is now spectating`);
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
    };
  }, [socket, autoSkipNewRound, players, startNewRound]);
  
  // Game actions
  const createRoom = (username, initialBalance = 1000) => {
    if (!connected) return;
    
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
    
    console.log('💰 [placeBet] Placing bet:', { amount, roomId, socketId: socket.id });
    
    // Optimistically update the local player's bet immediately
    setPlayers(prevPlayers => {
      const updated = prevPlayers.map(p => {
        if (p.id === socket.id) {
          console.log('💰 [placeBet] Updating local player bet:', { username: p.username, oldBet: p.bet, newBet: amount });
          return { ...p, bet: amount, balance: p.balance - amount };
        }
        return p;
      });
      console.log('💰 [placeBet] Updated players array:', updated.map(p => ({ username: p.username, bet: p.bet })));
      return updated;
    });
    
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
    if (!connected || !roomId) {
      console.error('Cannot kick player: not connected or no roomId', { connected, roomId });
      return;
    }
    
    if (!socket) {
      console.error('Cannot kick player: socket not available');
      return;
    }
    
    console.log('=== KICK ATTEMPT ===');
    console.log('RoomId:', roomId);
    console.log('PlayerId to kick:', playerId);
    console.log('Socket ID:', socket.id);
    console.log('Socket connected?', socket.connected);
    console.log('Socket active?', socket.active);
    
    // Verify socket is connected before emitting
    if (!socket.connected) {
      console.error('❌ Socket is not connected!');
      return;
    }
    
    // Test if socket can emit at all
    console.log('Testing socket connection...');
    socket.emit('ping', { test: 'connection' });
    
    // Emit the kick event
    console.log('Emitting kick_player event...');
    const eventData = { roomId, playerId };
    console.log('Event data:', eventData);
    
    socket.emit('kick_player', eventData);
    
    console.log('Event emitted, waiting for response...');
    
    // Listen for error response
    const errorTimeout = setTimeout(() => {
      console.warn('⚠️ No response from server after 2 seconds');
    }, 2000);
    
    socket.once('error', (error) => {
      clearTimeout(errorTimeout);
      console.error('❌ Socket error during kick:', error);
    });
    
    socket.once('player_kicked', (data) => {
      clearTimeout(errorTimeout);
      console.log('✅ Kick successful:', data);
    });
  };

  // Restart game - reset all players' balances to 1000
  const restartGame = () => {
    console.log('=== RESTART GAME CALLED ===');
    console.log('Connected:', connected);
    console.log('RoomId:', roomId);
    console.log('Socket:', socket?.id);
    console.log('Socket connected?', socket?.connected);
    
    if (!connected || !roomId) {
      console.error('Cannot restart game: not connected or no roomId', { connected, roomId });
      alert('Error: Not connected or no room ID. Please refresh the page.');
      return;
    }
    
    if (!socket) {
      console.error('Cannot restart game: socket not available');
      alert('Error: Socket not available. Please refresh the page.');
      return;
    }
    
    if (!socket.connected) {
      console.error('Socket is not connected!');
      alert('Error: Not connected to server. Please refresh the page.');
      return;
    }
    
    console.log('✅ Emitting restart_game event for room:', roomId);
    console.log('Event payload:', { roomId });
    
    // Emit the restart event
    socket.emit('restart_game', { roomId }, (response) => {
      // Callback for acknowledgment (if server supports it)
      console.log('Server response:', response);
    });
    
    // Listen for error response
    socket.once('error', (error) => {
      console.error('❌ Error restarting game:', error);
      if (error && error.message) {
        alert(`Error: ${error.message}`);
      } else if (error) {
        alert(`Error: ${JSON.stringify(error)}`);
      }
    });
    
    // Also listen for any response after a short delay
    setTimeout(() => {
      console.log('Checking if game_reset was received...');
    }, 1000);
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
        socket
      }}
    >
      {children}
    </GameContext.Provider>
  );
}; 