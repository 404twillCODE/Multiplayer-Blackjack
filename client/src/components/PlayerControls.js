import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(10px);
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  margin-bottom: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ActionButton = styled.button`
  padding: 1rem 0;
  border-radius: 12px;
  border: 2px solid transparent;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  svg {
    margin-bottom: 5px;
    font-size: 1.2rem;
  }
`;

const HitButton = styled(ActionButton)`
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #43a047 0%, #4caf50 100%);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
  }
`;

const StandButton = styled(ActionButton)`
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.6);
  }
`;

const DoubleButton = styled(ActionButton)`
  background: linear-gradient(135deg, #2196f3 0%, #1e88e5 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1e88e5 0%, #2196f3 100%);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.6);
  }
`;

const SplitButton = styled(ActionButton)`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #f57c00 0%, #ff9800 100%);
    box-shadow: 0 6px 20px rgba(255, 152, 0, 0.6);
  }
`;

const SurrenderButton = styled(ActionButton)`
  background: linear-gradient(135deg, #757575 0%, #616161 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(117, 117, 117, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #616161 0%, #757575 100%);
    box-shadow: 0 6px 20px rgba(117, 117, 117, 0.6);
  }
`;

const NewRoundButton = styled(ActionButton)`
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  color: white;
  grid-column: span 2;
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%);
    box-shadow: 0 6px 20px rgba(156, 39, 176, 0.6);
  }
`;

const Icon = styled.span`
  font-size: 1.5rem;
  margin-bottom: 5px;
`;

const ButtonText = styled.span`
  font-size: 0.9rem;
`;

const HintContainer = styled.div`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.95) 0%, rgba(244, 208, 63, 0.95) 100%);
  color: #0a2219;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-weight: 600;
  text-align: center;
  animation: fadeIn 0.5s ease-in;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CloseHintButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #333;
  
  &:hover {
    color: #000;
  }
`;

const PlayerControls = ({ currentPlayer, canSplit }) => {
  const { 
    hit, 
    stand, 
    doubleDown, 
    split, 
    surrender, 
    startNewRound, 
    gameState, 
    isPlayerTurn,
    hintsEnabled,
    dealer,
    currentTurn,
    autoSkipNewRound
  } = useGame();
  
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [showHintButton, setShowHintButton] = useState(false);
  
  // Timer for showing the hint button after 10 seconds of inactivity
  useEffect(() => {
    // Only start timer if hints are enabled and it's player's turn
    if (!hintsEnabled || !isPlayerTurn()) {
      setShowHintButton(false);
      return;
    }
    
    // Reset hint when player or turn changes
    setShowHint(false);
    
    const timer = setTimeout(() => {
      if (currentPlayer && isPlayerTurn()) {
        setShowHintButton(true);
      }
    }, 10000); // 10 seconds
    
    return () => clearTimeout(timer);
  }, [currentPlayer, isPlayerTurn, hintsEnabled, currentTurn]);
  
  // Reset hint and hint button when player makes a move
  const handleAction = (action) => {
    setShowHint(false);
    setShowHintButton(false);
    action();
  };
  
  // Handle showing hint when button is clicked
  const handleShowHint = () => {
    if (currentPlayer && isPlayerTurn()) {
      let hintText = getStrategyHint(currentPlayer);
      
      // Fallback hint if no specific strategy is found
      if (!hintText || hintText.trim() === '') {
        const total = currentPlayer.score || 0;
        if (total >= 17) {
          hintText = 'With a high total, standing is usually best.';
        } else if (total <= 8) {
          hintText = 'With a low total, hitting is usually best.';
        } else {
          hintText = `With a total of ${total}, consider the dealer's upcard.`;
        }
      }
      
      setHint(hintText);
      setShowHint(true);
    }
  };
  
  // Convert card value to numeric value
  // Note: Card values are stored as 'ace', 'king', 'queen', 'jack', or numbers as strings
  const getValue = (card) => {
    if (!card || !card.value) return 0;
    
    // Handle face cards and ace
    if (card.value === 'ace') return 11;
    if (['king', 'queen', 'jack'].includes(card.value)) return 10;
    
    // Handle numeric cards
    return parseInt(card.value, 10) || 0;
  };
  
  // Get dealer's upcard value (only the visible card)
  const getDealerUpcard = () => {
    // In blackjack, only the first card is visible to players
    if (!dealer || !dealer.cards || dealer.cards.length === 0) return null;
    
    // Only use the first card (the upcard)
    const upcard = dealer.cards[0];
    return getValue(upcard);
  };
  
  // Get strategy hint based on player's hand and dealer's upcard
  const getStrategyHint = (player) => {
    if (!player || !player.cards || player.cards.length === 0) return 'Wait for cards to be dealt.';
    
    // Get dealer's upcard value
    const dealerUpcard = getDealerUpcard();
    if (!dealerUpcard) return 'Basic strategy: Consider your total against dealer upcard.';
    
    // Check if player has a pair
    const isPair = player.cards.length === 2 && 
                  getValue(player.cards[0]) === getValue(player.cards[1]);
    
    // Check if player has a soft hand (contains an Ace counted as 11)
    // A soft hand is one where an ace is counted as 11 and the total is <= 21
    const hasSoftHand = player.cards.some(card => card.value === 'ace') && 
                        player.score <= 21;
    
    if (isPair) {
      return getPairHint(getValue(player.cards[0]), dealerUpcard);
    } else if (hasSoftHand) {
      return getSoftTotalHint(player.score, dealerUpcard);
    } else {
      return getHardTotalHint(player.score, dealerUpcard);
    }
  };
  
  // Get hint for pair hands
  const getPairHint = (pairValue, dealerUpcard) => {
    if (pairValue === 11) return 'Always split Aces.';
    if (pairValue === 10) return 'Never split Tens. Stand with this strong hand.';
    
    if (pairValue === 9) {
      if ([2, 3, 4, 5, 6, 8, 9].includes(dealerUpcard)) return 'Split 9s against dealer.';
      return 'Stand with 9s against dealer.';
    }
    
    if (pairValue === 8) return 'Always split 8s.';
    
    if (pairValue === 7) {
      if (dealerUpcard >= 2 && dealerUpcard <= 7) return 'Split 7s against dealer.';
      return 'Hit with 7s against dealer.';
    }
    
    if (pairValue === 6) {
      if (dealerUpcard >= 2 && dealerUpcard <= 6) return 'Split 6s against dealer.';
      return 'Hit with 6s against dealer.';
    }
    
    if (pairValue === 5) {
      if (dealerUpcard >= 2 && dealerUpcard <= 9) return 'Double with 5s against dealer.';
      return 'Hit with 5s against dealer.';
    }
    
    if (pairValue === 4) {
      if (dealerUpcard === 5 || dealerUpcard === 6) return 'Split 4s against dealer.';
      return 'Hit with 4s against dealer.';
    }
    
    if (pairValue === 3 || pairValue === 2) {
      if (dealerUpcard >= 2 && dealerUpcard <= 7) return `Split ${pairValue}s against dealer.`;
      return `Hit with ${pairValue}s against dealer.`;
    }
    
    // Fallback for any other pair
    return `With a pair of ${pairValue}s, consider hitting.`;
  };
  
  // Get hint for soft totals
  const getSoftTotalHint = (total, dealerUpcard) => {
    if (total >= 20) return 'Stand with Soft 20 or higher.';
    
    if (total === 19) {
      if (dealerUpcard === 6) return 'Double with Soft 19 against dealer.';
      return 'Stand with Soft 19.';
    }
    
    if (total === 18) {
      if (dealerUpcard >= 2 && dealerUpcard <= 6) return 'Double with Soft 18 against dealer.';
      if (dealerUpcard >= 9 || dealerUpcard === 11) return 'Hit with Soft 18 against dealer.';
      return 'Stand with Soft 18 against dealer.';
    }
    
    if (total === 17) {
      if (dealerUpcard >= 3 && dealerUpcard <= 6) return 'Double with Soft 17 against dealer.';
      return 'Hit with Soft 17 against dealer.';
    }
    
    if (total === 16) {
      if (dealerUpcard >= 4 && dealerUpcard <= 6) return 'Double with Soft 16 against dealer.';
      return 'Hit with Soft 16 against dealer.';
    }
    
    if (total === 15) {
      if (dealerUpcard >= 4 && dealerUpcard <= 6) return 'Double with Soft 15 against dealer.';
      return 'Hit with Soft 15 against dealer.';
    }
    
    if (total === 14) {
      if (dealerUpcard === 5 || dealerUpcard === 6) return 'Double with Soft 14 against dealer.';
      return 'Hit with Soft 14 against dealer.';
    }
    
    if (total === 13) {
      if (dealerUpcard === 5 || dealerUpcard === 6) return 'Double with Soft 13 against dealer.';
      return 'Hit with Soft 13 against dealer.';
    }
    
    // Fallback for any other soft total
    return `With Soft ${total}, hit to improve your hand.`;
  };
  
  // Get hint for hard totals
  const getHardTotalHint = (total, dealerUpcard) => {
    if (total >= 17) return 'Stand with 17 or higher.';
    
    if (total >= 13 && total <= 16) {
      if (dealerUpcard >= 2 && dealerUpcard <= 6) return `Stand with ${total} against dealer.`;
      return `Hit with ${total} against dealer.`;
    }
    
    if (total === 12) {
      if (dealerUpcard >= 4 && dealerUpcard <= 6) return 'Stand with 12 against dealer.';
      return 'Hit with 12 against dealer.';
    }
    
    if (total === 11) return 'Always double with 11.';
    
    if (total === 10) {
      if (dealerUpcard >= 2 && dealerUpcard <= 9) return 'Double with 10 against dealer.';
      return 'Hit with 10 against dealer.';
    }
    
    if (total === 9) {
      if (dealerUpcard >= 3 && dealerUpcard <= 6) return 'Double with 9 against dealer.';
      return 'Hit with 9 against dealer.';
    }
    
    if (total <= 8) return 'Always hit with 8 or lower.';
    
    // Fallback for any other hard total
    return `With a hard total of ${total}, the best play is usually to hit.`;
  };
  
  // Check if it's the player's turn directly
  const playerTurn = isPlayerTurn();
  
  // Check if this is a split hand
  const isSplitHand = currentPlayer?.id?.includes('-split');
  
  const isFirstAction = currentPlayer?.cards?.length === 2;
  const isGameEnded = gameState === 'ended';
  
  // Check if player can double down (only with first 2 cards)
  const canDoubleDown = playerTurn && isFirstAction;
  
  // Check if player can surrender (only as first action)
  const canSurrender = playerTurn && isFirstAction;
  
  // Can't split a split hand
  const canSplitHand = canSplit && !isSplitHand;
  
  return (
    <ControlsContainer>
      {showHint && hint && (
        <HintContainer>
          <span role="img" aria-label="hint">💡</span> {hint}
          <CloseHintButton onClick={() => setShowHint(false)}>✖</CloseHintButton>
        </HintContainer>
      )}
      
      <ActionsGrid>
        {isGameEnded && !autoSkipNewRound ? (
          <NewRoundButton 
            onClick={startNewRound}
            style={{ 
              gridColumn: "1 / span 3", 
              margin: "0 auto", 
              width: "50%",
              backgroundColor: "#9c27b0"
            }}
          >
            <Icon>🔄</Icon>
            <ButtonText>New Round</ButtonText>
          </NewRoundButton>
        ) : (
          <>
            <HitButton 
              onClick={() => handleAction(hit)} 
              disabled={!playerTurn}
              title="Draw another card"
            >
              <Icon>👆</Icon>
              <ButtonText>Hit</ButtonText>
            </HitButton>
            
            <StandButton 
              onClick={() => handleAction(stand)} 
              disabled={!playerTurn}
              title="End your turn"
            >
              <Icon>✋</Icon>
              <ButtonText>Stand</ButtonText>
            </StandButton>
            
            <DoubleButton 
              onClick={() => handleAction(doubleDown)} 
              disabled={!playerTurn || !canDoubleDown}
              title="Double your bet and receive one more card"
            >
              <Icon>💰</Icon>
              <ButtonText>Double</ButtonText>
            </DoubleButton>
            
            <SplitButton 
              onClick={() => handleAction(split)} 
              disabled={!playerTurn || !canSplitHand}
              title="Split your pair into two hands"
            >
              <Icon>✂️</Icon>
              <ButtonText>Split</ButtonText>
            </SplitButton>
            
            <SurrenderButton 
              onClick={() => handleAction(surrender)} 
              disabled={!playerTurn || !canSurrender}
              title="Forfeit half your bet and end your hand"
            >
              <Icon>🏳️</Icon>
              <ButtonText>Surrender</ButtonText>
            </SurrenderButton>
            
            {hintsEnabled && playerTurn && showHintButton && (
              <ActionButton 
                onClick={handleShowHint}
                style={{ backgroundColor: '#e2b714', color: 'black' }}
                title="Get strategy advice"
              >
                <Icon>💡</Icon>
                <ButtonText>Show Hint</ButtonText>
              </ActionButton>
            )}
          </>
        )}
      </ActionsGrid>
    </ControlsContainer>
  );
};

export default PlayerControls; 