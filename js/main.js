// Import PIXI as ES6 module from CDN
import * as PIXI from "https://cdn.skypack.dev/pixi.js@8.0.0";

// Make PIXI global for other files (temporary solution)
window.PIXI = PIXI;

// Import your game manager
import { GameManager } from "./gameManager.js";

// Initialize the game
const game = new GameManager();
game.init();
