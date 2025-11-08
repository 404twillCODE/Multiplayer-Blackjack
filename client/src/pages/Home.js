import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import JoinRoom from '../components/JoinRoom';
import Auth from '../components/Auth';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const comingSoon = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #0a2219 50%, #000000 100%);
  position: relative;
  overflow-x: hidden;
  
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

const HeroSection = styled.section`
  padding-top: 120px;
  padding-bottom: 60px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 72px;
  font-weight: 900;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 0 0 40px rgba(212, 175, 55, 0.5);
  
  @media (max-width: 768px) {
    font-size: 48px;
    letter-spacing: 2px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 24px;
  color: #fff;
  margin-bottom: 40px;
  opacity: 0.9;
  font-weight: 300;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const GamesSection = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 42px;
  color: #d4af37;
  text-align: center;
  margin-bottom: 50px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const GameCard = styled.div`
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: #d4af37;
    box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
`;

const GameIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  animation: ${props => props.$active ? float : 'none'} 3s ease-in-out infinite;
  filter: ${props => props.$wip ? 'grayscale(50%)' : 'none'};
`;

const GameTitle = styled.h3`
  font-size: 32px;
  color: #d4af37;
  margin-bottom: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const GameDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 16px;
  margin-bottom: 20px;
  min-height: 60px;
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.9) 0%, rgba(255, 87, 34, 0.9) 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: ${comingSoon} 2s ease-in-out infinite;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
`;


const JoinRoomSection = styled.section`
  max-width: 600px;
  margin: 40px auto 80px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  position: relative;
  z-index: 1;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(10, 34, 25, 0.3) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: #d4af37;
    box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay || 0}s;
`;

const FeatureTitle = styled.h3`
  font-size: 24px;
  color: #d4af37;
  margin-bottom: 15px;
  font-weight: 700;
`;

const FeatureDescription = styled.p`
  color: #fff;
  opacity: 0.8;
  line-height: 1.6;
  font-size: 16px;
`;

const CtaSection = styled.section`
  text-align: center;
  padding: 80px 20px;
  position: relative;
  z-index: 1;
`;

const CtaButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  padding: 20px 50px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(212, 175, 55, 0.6);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 40px 20px;
  color: #fff;
  opacity: 0.6;
  font-size: 14px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  position: relative;
  z-index: 1;
`;

const WipMessage = styled.div`
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(255, 152, 0, 0.5);
  border-radius: 16px;
  padding: 60px 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 152, 0, 0.2);
  backdrop-filter: blur(10px);
  text-align: center;
`;

const WipIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const WipTitle = styled.h2`
  color: #ff9800;
  font-size: 32px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(255, 152, 0, 0.5);
`;

const WipDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
    background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
  }
`;

const Home = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const { loading, username, isGuest } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // Show auth if user hasn't authenticated or chosen guest mode yet
  React.useEffect(() => {
    if (!loading && !username) {
      setShowAuth(true);
    } else if (username) {
      setShowAuth(false);
    }
  }, [loading, username]);

  const games = [
    {
      id: 'blackjack',
      name: 'Blackjack',
      icon: '🃏',
      description: 'Play classic blackjack with friends in real-time. Create rooms, invite players, and compete for the top spot on the leaderboard.',
      active: true,
      wip: false
    },
    {
      id: 'roulette',
      name: 'Roulette',
      icon: '🎰',
      description: 'Experience the excitement of European Roulette. Place your bets on red, black, numbers, or combinations. Coming soon!',
      active: false,
      wip: true
    },
    {
      id: 'slots',
      name: 'Slots',
      icon: '🎲',
      description: 'Spin the reels and win big! Multiple slot machines with exciting themes and bonus features. Coming soon!',
      active: false,
      wip: true
    }
  ];

  const selectedGameData = games.find(g => g.id === selectedGame);

  // Show auth screen if not authenticated
  if (showAuth) {
    return <Auth onAuthComplete={() => setShowAuth(false)} />;
  }

  if (loading) {
    return (
      <HomeContainer>
        <HeroSection>
          <HeroTitle>Luxury Casino</HeroTitle>
          <HeroSubtitle>Loading...</HeroSubtitle>
        </HeroSection>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Luxury Casino</HeroTitle>
        <HeroSubtitle>Choose your game and experience the thrill</HeroSubtitle>
        {isGuest && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            background: 'rgba(212, 175, 55, 0.1)', 
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            color: '#d4af37',
            fontSize: '0.9rem'
          }}>
            Playing as Guest: {username} - Sign up to save your progress!
          </div>
        )}
      </HeroSection>
      
      {!selectedGame ? (
        <GamesSection>
          <SectionTitle>Our Games</SectionTitle>
          <GamesGrid>
            {games.map((game) => (
              <GameCard
                key={game.id}
                $active={true}
                $wip={game.wip}
                onClick={() => setSelectedGame(game.id)}
              >
                {game.wip && <ComingSoonBadge>Coming Soon</ComingSoonBadge>}
                <GameIcon $active={true} $wip={game.wip}>
                  {game.icon}
                </GameIcon>
                <GameTitle>{game.name}</GameTitle>
                <GameDescription>{game.description}</GameDescription>
              </GameCard>
            ))}
          </GamesGrid>
        </GamesSection>
      ) : (
        <JoinRoomSection $show={true}>
          {selectedGameData?.wip ? (
            <WipMessage>
              <WipIcon>{selectedGameData.icon}</WipIcon>
              <WipTitle>{selectedGameData.name} - Coming Soon</WipTitle>
              <WipDescription>
                We're working hard to bring you an amazing {selectedGameData.name.toLowerCase()} experience! 
                This game is currently in development and will be available soon. Check back later for updates!
              </WipDescription>
              <BackButton onClick={() => setSelectedGame(null)}>
                ← Back to Games
              </BackButton>
            </WipMessage>
          ) : (
            <>
              <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
                <BackButton 
                  onClick={() => setSelectedGame(null)}
                  style={{ marginBottom: '30px' }}
                >
                  ← Back to Games
                </BackButton>
              </div>
              <JoinRoom />
            </>
          )}
        </JoinRoomSection>
      )}
      
      {!selectedGame && (
        <>
          <FeaturesSection>
            <SectionTitle>Why Choose Us</SectionTitle>
            <FeaturesGrid>
              <FeatureCard>
                <FeatureIcon $delay={0}>🎰</FeatureIcon>
                <FeatureTitle>Real-Time Multiplayer</FeatureTitle>
                <FeatureDescription>
                  Play with friends in real-time. Create private rooms and invite players for the ultimate gaming experience.
                </FeatureDescription>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon $delay={0.5}>🏆</FeatureIcon>
                <FeatureTitle>Competitive Leaderboard</FeatureTitle>
                <FeatureDescription>
                  Climb the ranks and compete with players worldwide. Track your wins and become a champion.
                </FeatureDescription>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon $delay={1}>💎</FeatureIcon>
                <FeatureTitle>Professional Experience</FeatureTitle>
                <FeatureDescription>
                  Enjoy a premium casino experience with smooth gameplay, beautiful graphics, and authentic game rules.
                </FeatureDescription>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon $delay={1.5}>🎲</FeatureIcon>
                <FeatureTitle>Fair & Secure</FeatureTitle>
                <FeatureDescription>
                  Play with confidence knowing every game is fair, secure, and uses industry-standard algorithms.
                </FeatureDescription>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon $delay={2}>⚡</FeatureIcon>
                <FeatureTitle>Fast & Responsive</FeatureTitle>
                <FeatureDescription>
                  Lightning-fast gameplay with instant updates. No lag, no waiting - just pure gaming action.
                </FeatureDescription>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon $delay={2.5}>🎯</FeatureIcon>
                <FeatureTitle>More Games Coming</FeatureTitle>
                <FeatureDescription>
                  We're constantly adding new games. Roulette and Slots are in development - stay tuned!
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </FeaturesSection>
          
          <CtaSection>
            <CtaButton to="/">Start Playing Now</CtaButton>
          </CtaSection>
        </>
      )}
      
      <Footer>
        © 2024 Luxury Casino - Play Responsibly | 18+ Only
      </Footer>
    </HomeContainer>
  );
};

export default Home;
