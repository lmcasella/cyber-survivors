import * as PIXI from "https://cdn.skypack.dev/pixi.js@8.0.0";
import { Entity } from "../entities/entity.js";

export class PowerUp extends Entity {
    constructor(gameManager, type, config) {
        super(gameManager);

        this.type = type;
        this.name = config.name;
        this.color = config.color;
        this.radius = config.radius || 8;

        // Create visual representation
        this.createSprite();

        // Random spawn position around player
        this.spawnRandomly();
    }

    createSprite() {
        const graphics = new PIXI.Graphics();
        graphics.circle(0, 0, this.radius);
        graphics.fill(this.color);

        // Add a white border for visibility
        graphics.circle(0, 0, this.radius);
        graphics.stroke({ color: 0xffffff, width: 2 });

        this.sprite = graphics;
        this.sprite.anchor = { x: 0.5, y: 0.5 };
    }

    spawnRandomly() {
        // Spawn at random position around player
        const player = this.game.player;
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 300; // 200-500 pixels from player

        this.position.x = player.position.x + Math.cos(angle) * distance;
        this.position.y = player.position.y + Math.sin(angle) * distance;

        this.sprite.position.copyFrom(this.position);
    }

    update(ticker) {
        // Simple floating animation
        this.sprite.position.y += Math.sin(ticker.lastTime * 0.01) * 0.5;

        // Check collision with player
        this.checkPlayerCollision();

        super.update(ticker);
    }

    checkPlayerCollision() {
        const player = this.game.player;
        const dx = this.position.x - player.position.x;
        const dy = this.position.y - player.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + 20) {
            // Player pickup radius
            this.onPickup(player);
            this.destroy();
        }
    }

    // Abstract method - each powerup type implements its own effect
    onPickup(player) {
        throw new Error("onPickup() method must be implemented by subclass");
    }

    destroy() {
        this.game.removeEntity(this);
    }
}
