import { Entity } from "./entity.js";
import { BaseEnemy } from "./enemy/baseEnemy.js";

export class Projectile extends Entity {
    constructor(gameManager, startX, startY, targetX, targetY, damage = 10) {
        super(gameManager);

        this.damage = damage;
        this.speed = 8; // Projectile speed
        this.lifeTime = 3000; // 3 seconds max lifetime (in milliseconds)
        this.age = 0;

        // Set starting position
        this.position.x = startX;
        this.position.y = startY;

        // Calculate direction to target
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize direction and apply speed
        if (distance > 0) {
            this.velocity.x = (dx / distance) * this.speed;
            this.velocity.y = (dy / distance) * this.speed;
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        // Create projectile sprite
        this.createProjectileSprite();

        // Set sprite position
        this.sprite.position.copyFrom(this.position);
    }

    createProjectileSprite() {
        // Create a simple yellow ball
        const graphics = new PIXI.Graphics();
        graphics.circle(0, 0, 5); // Small ball, radius 5
        graphics.fill(0xffff00); // Yellow color

        this.sprite = graphics;
        this.sprite.anchor = { x: 0.5, y: 0.5 }; // Center the sprite
    }

    update(ticker) {
        // Update age
        this.age += ticker.deltaMS;

        // Check if projectile should be destroyed (lifetime exceeded)
        if (this.age >= this.lifeTime) {
            this.destroy();
            return;
        }

        // Check if projectile is off-screen
        if (this.isOffScreen()) {
            this.destroy();
            return;
        }

        // Check collision with enemies
        this.checkEnemyCollisions();

        // Update position
        super.update(ticker);
    }

    isOffScreen() {
        const margin = 100; // Allow some margin before destroying
        const screenWidth = this.game.app.screen.width;
        const screenHeight = this.game.app.screen.height;

        // Get world bounds relative to camera
        const cameraX = this.game.player.position.x;
        const cameraY = this.game.player.position.y;

        const leftBound = cameraX - screenWidth / 2 - margin;
        const rightBound = cameraX + screenWidth / 2 + margin;
        const topBound = cameraY - screenHeight / 2 - margin;
        const bottomBound = cameraY + screenHeight / 2 + margin;

        return (
            this.position.x < leftBound ||
            this.position.x > rightBound ||
            this.position.y < topBound ||
            this.position.y > bottomBound
        );
    }

    checkEnemyCollisions() {
        // 🎯 Direct sprite-to-sprite collision detection
        for (const entity of this.game.entities) {
            if (entity instanceof BaseEnemy) {
                const dx = this.position.x - entity.position.x;
                const dy = this.position.y - entity.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 🔧 More precise collision detection
                const projectileRadius = 5; // Match your sprite radius
                const enemyRadius = 15; // Estimated enemy sprite radius
                const collisionDistance = projectileRadius + enemyRadius;

                if (distance < collisionDistance) {
                    // 💥 Direct hit on enemy sprite!
                    entity.takeDamage(this.damage);
                    console.log(
                        `🎯 Projectile hit ${entity.enemyType} sprite for ${this.damage} damage! Health: ${entity.health}`
                    );

                    // Optional: Create hit effect
                    this.createHitEffect(entity.position.x, entity.position.y);

                    this.destroy();
                    return;
                }
            }
        }
    }

    createHitEffect(x, y) {
        // 🎨 Visual feedback for hits
        const effect = new PIXI.Graphics();
        effect.circle(0, 0, 8);
        effect.fill(0xff4444); // Red hit effect
        effect.position.set(x, y);

        this.game.world.addChild(effect);

        // Remove effect after short time
        setTimeout(() => {
            if (effect.parent) {
                this.game.world.removeChild(effect);
            }
        }, 200);
    }

    destroy() {
        this.game.removeEntity(this);
    }
}
