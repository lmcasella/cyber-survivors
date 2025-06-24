import { BaseEnemy } from './baseEnemy.js';

export class GruntEnemy extends BaseEnemy {
    constructor(gameManager, player) {
        // Call the constructor of the BaseEnemy class
        super(gameManager, player);

        // --- Define properties specific to this enemy type ---
        this.speed = 1.5;
        this.health = 20;

        // Create the visual sprite for this enemy
        this.sprite = new PIXI.Graphics().circle(0, 0, 12).fill(0xff0000); // Red circle

        // Spawn at a random position
        this.position.x = Math.random() * this.game.app.screen.width;
        this.position.y = Math.random() * this.game.app.screen.height;
    }
}