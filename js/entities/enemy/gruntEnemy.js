import { BaseEnemy } from "./baseEnemy.js";

export class GruntEnemy extends BaseEnemy {
    constructor(gameManager, player, enemyAssets) {
        // Call the constructor of the BaseEnemy class
        super(gameManager, player, enemyAssets);

        // --- Define properties specific to this enemy type ---
        this.speed = 3;
        this.health = 20;
        this.damage = 25;

        // Customize boids behavior for grunt enemies
        this.separationWeight = 15.0; // Stronger separation - they're bigger/bulkier
        this.alignmentWeight = 0.3; // More alignment - they move in formation
        this.cohesionWeight = 0.01; // More cohesion - they stick together
        this.playerAttackWeight = 1.5; // Less aggressive - they're more defensive

        // this.customizeSprite();
    }

    customizeSprite() {
        if (this.sprite) {
            // Only set tint if it's an animated sprite or graphics
            if (this.sprite.tint !== undefined) {
                this.sprite.tint = 0x8b0000; // Dark red for grunts
            }

            // Scale up for grunt enemy
            if (this.sprite.scale) {
                this.sprite.scale.set(1.2); // Bigger
            }

            // If it's a Graphics fallback, change the color and size
            if (this.sprite instanceof PIXI.Graphics) {
                this.sprite.clear();
                this.sprite.circle(0, 0, 18); // Bigger circle
                this.sprite.fill(0x8b0000); // Dark red color
            }
        }
    }

    attackPlayerInCell() {
        if (this.timeSinceLastAttack < this.attackCooldown) return;

        const enemyKey = this.game.spatialHash.getKey(
            this.position.x,
            this.position.y
        );
        const playerKey = this.game.spatialHash.getKey(
            this.player.position.x,
            this.player.position.y
        );

        if (enemyKey === playerKey) {
            this.player.takeDamage(this.damage);
            this.timeSinceLastAttack = 0;
            console.log(
                `💪 ${this.enemyType} CRUSHED player for ${this.damage} damage!`
            );
        }
    }
}
