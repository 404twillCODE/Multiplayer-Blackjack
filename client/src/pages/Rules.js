import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 120px 2rem 2rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #0a2219 50%, #000000 100%);
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

const Card = styled.div`
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.2);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #d4af37;
  text-align: center;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #d4af37;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
  padding-bottom: 0.5rem;
  font-weight: 700;
`;

const List = styled.ul`
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

const ListItem = styled.li`
  margin-bottom: 0.8rem;
  line-height: 1.6;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #1e88e5;
    transform: translateY(-2px);
  }
`;

function Rules() {
  const navigate = useNavigate();

  return (
    <RulesContainer>
      <Card>
        <Title>📜 Blackjack Rules</Title>

        <Section>
          <SectionTitle>Game Objective</SectionTitle>
          <p>
            The goal of blackjack is to beat the dealer by having a hand value closer to 21 without going over.
            If your hand goes over 21, you "bust" and lose the bet automatically.
          </p>
        </Section>

        <Section>
          <SectionTitle>Card Values</SectionTitle>
          <List>
            <ListItem>
              <strong>Number cards (2-10):</strong> Worth their face value
            </ListItem>
            <ListItem>
              <strong>Face cards (Jack, Queen, King):</strong> Worth 10 points each
            </ListItem>
            <ListItem>
              <strong>Aces:</strong> Worth either 1 or 11 points, whichever is more favorable to the hand
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Dealer Rules</SectionTitle>
          <List>
            <ListItem>Dealer stands on all 17s (including "soft" 17s)</ListItem>
            <ListItem>Dealer's first card is dealt face down (hole card)</ListItem>
            <ListItem>Dealer's second card is dealt face up</ListItem>
            <ListItem>Dealer reveals hole card after all players have completed their turns</ListItem>
            <ListItem>Dealer must hit until reaching at least 17</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Player Actions</SectionTitle>
          <List>
            <ListItem>
              <strong>Hit:</strong> Request another card to increase your hand value
            </ListItem>
            <ListItem>
              <strong>Stand:</strong> End your turn and keep your current hand value
            </ListItem>
            <ListItem>
              <strong>Double Down:</strong> Double your bet and receive exactly one more card
            </ListItem>
            <ListItem>
              <strong>Split:</strong> If you have two cards of the same value, you can split them into two separate hands (requires placing a bet equal to your original bet)
            </ListItem>
            <ListItem>
              <strong>Surrender:</strong> Give up your hand and lose only half your bet (only available as your first decision)
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Payouts</SectionTitle>
          <List>
            <ListItem>
              <strong>Blackjack (Ace + 10-value card):</strong> Pays 3:2
            </ListItem>
            <ListItem>
              <strong>Regular win:</strong> Pays 1:1 (even money)
            </ListItem>
            <ListItem>
              <strong>Insurance:</strong> Pays 2:1 (offered when dealer's up-card is an Ace)
            </ListItem>
            <ListItem>
              <strong>Push (tie):</strong> Bet is returned
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Game Progression</SectionTitle>
          <ol style={{ marginLeft: '1.5rem' }}>
            <ListItem>All players place their bets</ListItem>
            <ListItem>Dealer deals two cards to each player (face up) and two to themselves (one face up, one face down)</ListItem>
            <ListItem>Each player takes their turn, starting from the left of the dealer</ListItem>
            <ListItem>After all players complete their turns, dealer reveals their hole card</ListItem>
            <ListItem>Dealer draws cards according to the rules (must hit until 17 or higher)</ListItem>
            <ListItem>Bets are settled based on the results</ListItem>
          </ol>
        </Section>

        <BackButton onClick={() => navigate('/')}>
          ← Back to Lobby
        </BackButton>
      </Card>
    </RulesContainer>
  );
}

export default Rules; 