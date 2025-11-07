import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 120px 20px 40px;
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

const PageTitle = styled.h1`
  font-size: 42px;
  color: #d4af37;
  margin-bottom: 40px;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  position: relative;
  z-index: 1;
`;

const LeaderboardCard = styled.div`
  background: linear-gradient(135deg, rgba(10, 34, 25, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.2);
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid rgba(212, 175, 55, 0.5);
  color: #d4af37;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &:hover {
    background-color: rgba(229, 198, 135, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const RankCell = styled(TableCell)`
  font-weight: bold;
  width: 60px;
`;

const BalanceCell = styled(TableCell)`
  color: #4caf50;
  font-weight: bold;
  text-align: right;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 12px 25px;
  background-color: #144b2f;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.1s;
  
  &:hover {
    background-color: #1a6340;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Leaderboard = () => {
  const { leaderboard } = useGame();
  
  // To format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <LeaderboardContainer>
      <PageTitle>Blackjack Leaderboard</PageTitle>
      
      <LeaderboardCard>
        {leaderboard && leaderboard.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <TableHeader>Rank</TableHeader>
                <TableHeader>Player</TableHeader>
                <TableHeader style={{ textAlign: 'right' }}>Balance</TableHeader>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <TableRow key={player.id}>
                  <RankCell>#{index + 1}</RankCell>
                  <TableCell>{player.username}</TableCell>
                  <BalanceCell>{formatCurrency(player.balance)}</BalanceCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            No players on the leaderboard yet. Start playing to see rankings!
          </EmptyState>
        )}
      </LeaderboardCard>
      
      <BackButton to="/">Back to Home</BackButton>
    </LeaderboardContainer>
  );
};

export default Leaderboard; 