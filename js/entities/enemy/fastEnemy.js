import { BaseEnemy } from "./baseEnemy.js";

export class FastEnemy extends BaseEnemy {
    constructor(gameManager, player, enemyAssets) {
        // Call the constructor of the BaseEnemy class
        super(gameManager, player, enemyAssets);

        // --- Define properties specific to this enemy type ---
        this.speed = 3.5;
        this.health = 10;
        this.damage = 15;

        // Customize boids behavior for fast enemies
        this.separationWeight = 15.0; // Less separation - they're more chaotic
        this.alignmentWeight = 0.3; // Less alignment - more individual movement
        this.cohesionWeight = 0.01; // Less cohesion - they spread out more
        this.playerAttackWeight = 1.5; // More aggressive - they rush the player

        // // Create sprite using assets (fallback to basic graphics if no assets)
        // if (this.enemyAssets && this.enemyAssets.demon) {
        //     // Use loaded demon assets for fast enemy (could be different asset)
        //     this.sprite = new PIXI.AnimatedSprite(
        //         this.enemyAssets.demon.animations.idle
        //     );
        //     this.sprite.animationSpeed = 0.2; // Faster animation for fast enemy
        //     this.sprite.anchor.set(0.5, 0.5);
        //     this.sprite.scale.set(0.8); // Make it smaller than grunt
        //     this.sprite.tint = 0x00ffff; // Cyan tint to differentiate
        //     this.sprite.play();
        // } else {
        //     // Fallback to basic graphics
        //     this.sprite = new PIXI.Graphics().circle(0, 0, 8).fill(0x00ffff); // Cyan circle
        // }

        this.customizeSprite();

        // Position will be set by GameManager's spawnEnemiesAwayFromPlayer method
    }

    customizeSprite() {
        if (this.sprite) {
            // Only set tint if it's an animated sprite or graphics
            if (this.sprite.tint !== undefined) {
                this.sprite.tint = 0x00ced1; // Cyan for fast enemies
            }

            // Scale down for fast enemy
            if (this.sprite.scale) {
                this.sprite.scale.set(0.8); // Smaller
            }

            // If it's a Graphics fallback, change the color
            if (this.sprite instanceof PIXI.Graphics) {
                this.sprite.clear();
                this.sprite.circle(0, 0, 12); // Smaller circle
                this.sprite.fill(0x00ced1); // Cyan color
            }
        }
    }

    // Override with erratic movement
    calculatePlayerAttackForce() {
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // Add some randomness to fast enemy movement
            const randomX = (Math.random() - 0.5) * 0.3;
            const randomY = (Math.random() - 0.5) * 0.3;

            return {
                x: dx / distance + randomX,
                y: dy / distance + randomY,
            };
        }
        return { x: 0, y: 0 };
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
                `⚡ ${this.enemyType} struck player for ${this.damage} damage!`
            );
        }
    }
}
