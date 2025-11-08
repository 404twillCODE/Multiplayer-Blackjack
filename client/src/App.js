import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import GameRoom from './pages/GameRoom';
import Rules from './pages/Rules';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body, html {
    height: 100%;
    background-color: #0a0a0a;
    color: #fff;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100%;
  }
  
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #d4af37, #f4d03f);
    border-radius: 5px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #f4d03f, #d4af37);
  }
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AuthProvider>
        <GameProvider>
          <Routes>
            <Route path="/game-room" element={<GameRoom />} />
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
              </>
            } />
            <Route path="/rules" element={
              <>
                <Navbar />
                <Rules />
              </>
            } />
            <Route path="/leaderboard" element={
              <>
                <Navbar />
                <Leaderboard />
              </>
            } />
            <Route path="/profile" element={
              <>
                <Navbar />
                <Profile />
              </>
            } />
          </Routes>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 