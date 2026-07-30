import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', title: 'First Bite', description: 'Eat your first piece of food.', icon: '🍎' },
  { id: 'snake_charmer', title: 'Snake Charmer', description: 'Reach a length of 20 segments.', icon: '🐍' },
  { id: 'behemoth', title: 'Behemoth', description: 'Reach a length of 50 segments.', icon: '🐉' },
  { id: 'century', title: 'Century Club', description: 'Score 100 points in a single game.', icon: '💯' },
  { id: 'speed_demon_5', title: 'Speed Demon', description: 'Reach a 5x score combo.', icon: '⚡' },
  { id: 'rich_100', title: 'Getting Rich', description: 'Accumulate 100 coins in your wallet.', icon: '💰' },
  { id: 'rich_500', title: 'Wealthy', description: 'Accumulate 500 coins in your wallet.', icon: '💎' },
  { id: 'collector_5', title: 'Collector', description: 'Unlock 5 different skins.', icon: '🎨' },
  { id: 'collector_10', title: 'Wardrobe', description: 'Unlock 10 different skins.', icon: '🛍️' },
  { id: 'dedicated_10', title: 'Novice', description: 'Play 10 games.', icon: '🕹️' },
  { id: 'dedicated_50', title: 'Dedicated', description: 'Play 50 games.', icon: '🏆' },
];
