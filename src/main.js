import { Game } from './Game.js';
import { UI } from './UI.js';
import { MiniGame } from './MiniGame.js';
import { Leaderboard } from './Leaderboard.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const ui = new UI(game);
  const miniGame = new MiniGame(game);
  const leaderboard = new Leaderboard(game);
  game.start();
});