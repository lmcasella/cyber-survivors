import { BaseEnemy } from "./baseEnemy.js";

export class GruntEnemy extends BaseEnemy {
    constructor(gameManager, player) {
        // Call the constructor of the BaseEnemy class
        super(gameManager, player);

        // --- Define properties specific to this enemy type ---
        this.speed = 3;
        this.health = 20;
        this.damage = 25;

        // Customize boids behavior for grunt enemies
        this.separationWeight = 15.0; // Stronger separation - they're bigger/bulkier
        this.alignmentWeight = 0.3; // More alignment - they move in formation
        this.cohesionWeight = 0.05; // More cohesion - they stick together
        this.playerAttackWeight = 1.5; // Less aggressive - they're more defensive

        // Create the visual sprite for this enemy
        this.sprite = new PIXI.Graphics().circle(0, 0, 12).fill(0xff0000); // Red circle

        // Spawn at a random position
        this.position.x = Math.random() * this.game.app.screen.width;
        this.position.y = Math.random() * this.game.app.screen.height;
    }

    // Optional: Override specific behaviors for grunt enemies
    calculatePlayerAttackForce() {
        // Grunts are more defensive - they approach more cautiously
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // Slower approach when close to player
            const approachMultiplier = distance > 50 ? 0.6 : 0.3;
            return {
                x: (dx / distance) * approachMultiplier,
                y: (dy / distance) * approachMultiplier,
            };
        }
        return { x: 0, y: 0 };
    }
}
