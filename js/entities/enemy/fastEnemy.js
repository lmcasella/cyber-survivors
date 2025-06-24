import { BaseEnemy } from './baseEnemy.js';

export class FastEnemy extends BaseEnemy {
    constructor(gameManager, player) {
        // Call the constructor of the BaseEnemy class
        super(gameManager, player);

        // --- Define properties specific to this enemy type ---
        this.speed = 3;
        this.health = 10;

        // Create the visual sprite for this enemy
        this.sprite = new PIXI.Graphics().circle(0, 0, 8).fill(0x00ffff); // Cyan circle

        // Spawn at a random position
        this.position.x = Math.random() * this.game.app.screen.width;
        this.position.y = Math.random() * this.game.app.screen.height;
    }
}