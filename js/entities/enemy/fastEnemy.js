import { BaseEnemy } from "./baseEnemy.js";

export class FastEnemy extends BaseEnemy {
    constructor(gameManager, player) {
        // Call the constructor of the BaseEnemy class
        super(gameManager, player);

        // --- Define properties specific to this enemy type ---
        this.speed = 3.5;
        this.health = 10;
        this.damage = 15;

        // Customize boids behavior for fast enemies
        this.separationWeight = 8.0; // Less separation - they're more chaotic
        this.alignmentWeight = 0.1; // Less alignment - more individual movement
        this.cohesionWeight = 0.01; // Less cohesion - they spread out more
        this.playerAttackWeight = 1.5; // More aggressive - they rush the player

        // Create the visual sprite for this enemy
        this.sprite = new PIXI.Graphics().circle(0, 0, 8).fill(0x00ffff); // Cyan circle

        // Spawn at a random position
        this.position.x = Math.random() * this.game.app.screen.width;
        this.position.y = Math.random() * this.game.app.screen.height;
    }

    // Optional: Override specific behaviors for fast enemies
    calculatePlayerAttackForce() {
        // Fast enemies are more aggressive and erratic
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // More aggressive approach, with slight randomness
            const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
            return {
                x: (dx / distance) * 1.2 * randomFactor,
                y: (dy / distance) * 1.2 * randomFactor,
            };
        }
        return { x: 0, y: 0 };
    }
}
