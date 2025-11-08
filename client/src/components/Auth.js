import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  padding: 20px;
`;

const AuthCard = styled.div`
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.98) 0%, rgba(0, 0, 0, 0.98) 100%);
  border: 3px solid #d4af37;
  border-radius: 20px;
  padding: 40px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.4);
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  color: #d4af37;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 30px;
  font-size: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px;
  background: transparent;
  border: none;
  color: ${props => props.$active ? '#d4af37' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.$active ? '#d4af37' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    color: #d4af37;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 15px;
  border-radius: 10px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  background-color: rgba(10, 34, 25, 0.8);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
    background-color: rgba(10, 34, 25, 1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  border-radius: 10px;
  border: none;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
  }
`;

const GuestButton = styled(Button)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  color: #d4af37;
  border: 2px solid rgba(212, 175, 55, 0.5);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  text-align: center;
  padding: 10px;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: rgba(255, 255, 255, 0.5);
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(212, 175, 55, 0.3);
  }
  
  &::before {
    margin-right: 10px;
  }
  
  &::after {
    margin-left: 10px;
  }
`;

const Auth = ({ onAuthComplete }) => {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, continueAsGuest } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }
        const { error, requiresConfirmation } = await signUp(email, password, username);
        if (error) {
          setError(error.message);
        } else if (requiresConfirmation) {
          setError('Please check your email to confirm your account before signing in.');
        } else {
          onAuthComplete?.();
        }
      } else {
        const { error } = await signIn(emailOrUsername, password);
        if (error) {
          setError(error.message);
        } else {
          onAuthComplete?.();
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    onAuthComplete?.();
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Title>🎰 Luxury Casino</Title>
        <Subtitle>Sign in to save your progress, or continue as a guest</Subtitle>
        
        <Tabs>
          <Tab $active={mode === 'signin'} onClick={() => setMode('signin')}>
            Sign In
          </Tab>
          <Tab $active={mode === 'signup'} onClick={() => setMode('signup')}>
            Sign Up
          </Tab>
        </Tabs>

        <Form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          {mode === 'signin' ? (
            <Input
              type="text"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          ) : (
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
          </PrimaryButton>
        </Form>

        <Divider>OR</Divider>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <GuestButton onClick={handleGuest} disabled={loading} style={{ width: '100%', maxWidth: '300px' }}>
            Continue as Guest
          </GuestButton>
        </div>
      </AuthCard>
    </AuthContainer>
  );
};

export default Auth;

