import * as PIXI from "https://cdn.skypack.dev/pixi.js@8.0.0";
import { Entity } from "../entities/entity.js";
import { GAME_CONFIG } from "../core/gameConstants.js";

export class PowerUp extends Entity {
    constructor(gameManager, type, config) {
        super(gameManager);

        this.type = type;
        this.name = config.name;
        this.color = config.color;
        this.radius = config.radius || 8;
        this.spriteConfig = config.sprite || null;
        this.weaponTexture = config.weaponTexture || null;

        this.pickupRadius = GAME_CONFIG.POWERUPS.PICKUP_RADIUS;
        this.age = 0;
        this.bobOffset = Math.random() * Math.PI * 2; // Random bob start
        this.spawnEffect();

        // Create visual representation
        this.createSprite();

        // Random spawn position around player
        this.spawnRandomly();
    }

    spawnEffect() {
        // Enhanced spawn effect for real sprites
        const particleCount = 12;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const particle = new PIXI.Graphics();

            particle.circle(0, 0, 2);
            particle.fill(this.color);

            const startX = this.position.x + Math.cos(angle) * 30;
            const startY = this.position.y + Math.sin(angle) * 30;

            particle.position.set(startX, startY);
            this.game.world.addChild(particle);

            const animateParticle = () => {
                const dx = this.position.x - particle.x;
                const dy = this.position.y - particle.y;

                particle.x += dx * 0.08;
                particle.y += dy * 0.08;
                particle.alpha -= 0.015;

                if (particle.alpha > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    if (particle.parent) {
                        this.game.world.removeChild(particle);
                    }
                }
            };

            setTimeout(() => animateParticle(), i * 30);
        }
    }

    createSprite() {
        if (this.weaponTexture) {
            // Create sprite-based powerup
            this.createRealSpriteBasedPowerUp();
        } else if (this.spriteConfig) {
            // Fallback to circle-based powerup
            this.createSpriteBasedPowerUp();
        } else {
            this.createCircleBasedPowerUp();
        }

        this.sprite.position.copyFrom(this.position);
    }

    createRealSpriteBasedPowerUp() {
        // Create container for the weapon sprite and effects
        this.sprite = new PIXI.Container();

        // Background glow effect (larger for real sprites)
        const glow = new PIXI.Graphics();
        glow.circle(0, 0, this.radius + 12);
        glow.fill({ color: this.color, alpha: 0.4 });
        this.sprite.addChild(glow);

        // Real weapon sprite
        const weaponSprite = new PIXI.Sprite(this.weaponTexture);
        weaponSprite.anchor.set(0.5, 0.5);

        // Scale weapon to appropriate size (adjust as needed)
        const targetSize = this.radius * 2.5; // Make it bigger than the radius
        const scale =
            targetSize / Math.max(weaponSprite.width, weaponSprite.height);
        weaponSprite.scale.set(scale);

        this.sprite.addChild(weaponSprite);

        // Optional: Add border/outline effect
        const border = new PIXI.Graphics();
        border.circle(0, 0, this.radius + 8);
        border.stroke({ color: this.color, width: 2, alpha: 0.8 });
        this.sprite.addChild(border);

        // Floating text label
        const label = this.createFloatingLabel();
        this.sprite.addChild(label);

        // Store references for animation
        this.glowEffect = glow;
        this.weaponGraphics = weaponSprite;
        this.borderEffect = border;
        this.labelText = label;
    }

    createSpriteBasedPowerUp() {
        // Fallback to drawn graphics (keep existing implementation)
        this.sprite = new PIXI.Container();

        const glow = new PIXI.Graphics();
        glow.circle(0, 0, this.radius + 8);
        glow.fill({ color: this.color, alpha: 0.3 });
        this.sprite.addChild(glow);

        const weaponSprite = this.createWeaponSprite();
        this.sprite.addChild(weaponSprite);

        const label = this.createFloatingLabel();
        this.sprite.addChild(label);

        this.glowEffect = glow;
        this.weaponGraphics = weaponSprite;
        this.labelText = label;
    }

    createFloatingLabel() {
        const text = new PIXI.Text({
            text: this.name,
            style: {
                fontFamily: "Arial",
                fontSize: 11,
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 2 },
                align: "center",
                fontWeight: "bold",
            },
        });

        text.anchor.set(0.5, 0.5);
        text.y = this.radius + 18; // Position below weapon

        return text;
    }

    createCircleBasedPowerUp() {
        // For health/speed powerups (keep existing implementation)
        this.sprite = new PIXI.Graphics();

        // Outer glow
        this.sprite.circle(0, 0, this.radius + 4);
        this.sprite.fill({ color: this.color, alpha: 0.3 });

        // Main circle
        this.sprite.circle(0, 0, this.radius);
        this.sprite.fill(this.color);

        // Inner highlight
        this.sprite.circle(-2, -2, this.radius - 3);
        this.sprite.fill({ color: 0xffffff, alpha: 0.4 });
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
