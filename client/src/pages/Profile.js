import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #0a2219 50%, #000000 100%);
  padding-top: 100px;
  padding-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  overflow-x: hidden;
`;

const ProfileCard = styled.div`
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 3px solid #d4af37;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.4);
  backdrop-filter: blur(10px);
  margin: 0 20px;
`;

const Title = styled.h1`
  color: #d4af37;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(10, 34, 25, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.3);
`;

const SectionTitle = styled.h2`
  color: #d4af37;
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #d4af37;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BalanceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%);
  border-radius: 10px;
  border: 2px solid rgba(212, 175, 55, 0.4);
  margin-top: 10px;
`;

const BalanceAmount = styled.span`
  color: #d4af37;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: ${props => props.$type === 'guest' 
    ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.3) 0%, rgba(255, 152, 0, 0.2) 100%)' 
    : 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.2) 100%)'};
  color: ${props => props.$type === 'guest' ? '#ff9800' : '#4caf50'};
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid ${props => props.$type === 'guest' 
    ? 'rgba(255, 152, 0, 0.5)' 
    : 'rgba(76, 175, 80, 0.5)'};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  flex: 1;
  min-width: 150px;
  padding: 15px 30px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  border: 2px solid rgba(212, 175, 55, 0.8);
  
  &:hover {
    background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
  }
`;

const SecondaryButton = styled(Button)`
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.8) 0%, rgba(211, 47, 47, 0.9) 100%);
  color: white;
  border: 2px solid rgba(244, 67, 54, 0.5);
  
  &:hover {
    background: linear-gradient(135deg, rgba(211, 47, 47, 0.9) 0%, rgba(244, 67, 54, 0.8) 100%);
    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
`;

const Profile = () => {
  const { user, username, balance, isGuest, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!username) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <EmptyState>
            <p>Please sign in or continue as guest to view your profile.</p>
          </EmptyState>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <Title>👤 Profile</Title>
        
        <Section>
          <SectionTitle>
            <span>👤</span>
            Account Information
          </SectionTitle>
          <InfoRow>
            <InfoLabel>Username:</InfoLabel>
            <InfoValue>{username}</InfoValue>
          </InfoRow>
          {user && (
            <InfoRow>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{user.email}</InfoValue>
            </InfoRow>
          )}
          <InfoRow>
            <InfoLabel>Account Type:</InfoLabel>
            <Badge $type={isGuest ? 'guest' : 'registered'}>
              {isGuest ? 'Guest' : 'Registered'}
            </Badge>
          </InfoRow>
        </Section>

        <Section>
          <SectionTitle>
            <span>💰</span>
            Balance
          </SectionTitle>
          <BalanceDisplay>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.2rem' }}>$</span>
            <BalanceAmount>{balance.toLocaleString()}</BalanceAmount>
          </BalanceDisplay>
          {isGuest && (
            <p style={{ 
              color: 'rgba(255, 152, 0, 0.8)', 
              fontSize: '0.9rem', 
              marginTop: '15px',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              ⚠️ Guest accounts reset on sign out. Sign up to save your progress!
            </p>
          )}
        </Section>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/')}>
            Back to Home
          </PrimaryButton>
          <SecondaryButton onClick={handleSignOut}>
            Sign Out
          </SecondaryButton>
        </ButtonGroup>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;

