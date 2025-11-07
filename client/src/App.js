import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { GameProvider } from './contexts/GameContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import GameRoom from './pages/GameRoom';
import Rules from './pages/Rules';
import Leaderboard from './pages/Leaderboard';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
  
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
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App; 