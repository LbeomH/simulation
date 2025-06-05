import { Game } from './Game.js';
import { UI } from './UI.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const ui = new UI(game);
  game.start();
});