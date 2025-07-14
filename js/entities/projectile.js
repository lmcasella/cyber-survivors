import { Entity } from "./entity.js";
import { BaseEnemy } from "./enemy/baseEnemy.js";

export class Projectile extends Entity {
    constructor(
        gameManager,
        startX,
        startY,
        targetX,
        targetY,
        damage = 10,
        player
    ) {
        super(gameManager);

        this.damage = damage;
        this.speed = 20;
        this.lifeTime = 5000;
        this.age = 0;

        this.position.x = startX;
        this.position.y = startY;

        // Calcular la dirección y velocidad del proyectil
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let diferenciaX = 0;
        let diferenciaY = 0;

        if (player) {
            // Si el jugador está presente, ajusta la velocidad del proyectil
            diferenciaX = player.velocity.x;
            diferenciaY = player.velocity.y;
        }

        // Normaliza la dirección
        if (distance > 0) {
            this.velocity.x = (dx / distance) * this.speed + diferenciaX;
            this.velocity.y = (dy / distance) * this.speed + diferenciaY;
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        console.log(this.velocity);

        // Crear
        this.createProjectileSprite();

        // Setea la posición del sprite
        this.sprite.position.copyFrom(this.position);
    }

    // Crear sprite del proyectil
    createProjectileSprite() {
        const graphics = new PIXI.Graphics();
        graphics.circle(0, 0, 5);
        graphics.fill(0xffff00);

        this.sprite = graphics;
        this.sprite.anchor = { x: 0.5, y: 0.5 };
    }

    update(ticker) {
        this.age += ticker.deltaMS;

        // Elimina el proyectil si alcanzó su tiempo de vida
        if (this.age >= this.lifeTime) {
            this.destroy();
            return;
        }

        // Elimina el proyectil si está fuera de la pantalla
        if (this.isOffScreen()) {
            this.destroy();
            return;
        }

        // Checkea colisiones con enemigos
        this.checkEnemyCollisions();

        super.update(ticker);
    }

    isOffScreen() {
        const margin = 100;
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
        // Checkea colisiones con enemigos (celda?)
        for (const entity of this.game.entities) {
            if (entity instanceof BaseEnemy) {
                const dx = this.position.x - entity.position.x;
                const dy = this.position.y - entity.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Distancia de colisión?
                const projectileRadius = 5;
                const enemyRadius = 15;
                const collisionDistance = projectileRadius + enemyRadius;

                if (distance < collisionDistance) {
                    entity.takeDamage(this.damage);
                    console.log(
                        `🎯 Projectile hit ${entity.enemyType} sprite for ${this.damage} damage! Health: ${entity.health}`
                    );

                    this.createHitEffect(entity.position.x, entity.position.y);

                    this.destroy();
                    return;
                }
            }
        }
    }

    createHitEffect(x, y) {
        const effect = new PIXI.Graphics();
        effect.circle(0, 0, 8);
        effect.fill(0xff4444);
        effect.position.set(x, y);

        this.game.world.addChild(effect);

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
