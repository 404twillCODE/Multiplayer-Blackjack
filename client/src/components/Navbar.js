import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(180deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #d4af37;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const NavContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #d4af37;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #f4d03f;
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.span`
  font-size: 32px;
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #d4af37, #f4d03f);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #d4af37;
    
    &::after {
      width: 80%;
    }
  }
  
  ${props => props.$active && `
    color: #d4af37;
    
    &::after {
      width: 80%;
    }
  `}
`;

const PlayButton = styled(Link)`
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #0a2219;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
    background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Navbar = () => {
  const location = useLocation();
  
  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">
          <LogoIcon>♠️</LogoIcon>
          <span>Luxury Casino</span>
        </Logo>
        
        <NavLinks>
          <NavLink to="/" $active={location.pathname === '/'}>
            Home
          </NavLink>
          <NavLink to="/rules" $active={location.pathname === '/rules'}>
            Rules
          </NavLink>
          <NavLink to="/leaderboard" $active={location.pathname === '/leaderboard'}>
            Leaderboard
          </NavLink>
          <PlayButton to="/">
            Play Now
          </PlayButton>
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;

