import { GameManager } from './gameManager.js';

// This function runs once the HTML document is fully loaded.
window.addEventListener('DOMContentLoaded', () => {
  const game = new GameManager();
  game.init();
});