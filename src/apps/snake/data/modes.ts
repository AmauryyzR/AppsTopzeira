import { GameMode } from '../types';

export const MODES = [
  {
    id: GameMode.CLASSIC,
    name: 'Classic',
    description: 'The traditional snake experience. Avoid the walls and your own tail.',
    icon: '🐍'
  },
  {
    id: GameMode.NO_WALLS,
    name: 'No Walls',
    description: 'Pass through the borders to appear on the other side. Endless wrap-around action.',
    icon: '🌀'
  },
  {
    id: GameMode.TIME_ATTACK,
    name: 'Time Attack',
    description: '60 seconds to score as high as possible. Speed is key!',
    icon: '⏱️'
  },
  {
    id: GameMode.COIN_FEVER,
    name: 'Coin Fever',
    description: 'Coins galore! Survive longer to make coins worth up to 10x. Walls are solid.',
    icon: '💰'
  },
  {
    id: GameMode.ALL_IN,
    name: 'All in',
    description: 'Feeling lucky? Bet your coins in the slot machine. Spin 3 coins to win 5x payout!',
    icon: '🎰'
  }
];
