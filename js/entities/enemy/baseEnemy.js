import { Entity } from "../entity.js";
import { SpatialHash } from "../../core/spatialHash.js";

export class BaseEnemy extends Entity {
    constructor(gameManager, player) {
        super(gameManager);
        this.player = player;

        this.speed = 2;
        this.health = 10;
        this.damage = 0;

        this.attackCooldown = 1000;
        this.timeSinceLastAttack = this.attackCooldown;

        // Boids
        this.neighborRadius = 100;
        this.separationWeight = 10.0;
        this.alignmentWeight = 0.2;
        this.cohesionWeight = 0.02;
        this.playerAttackWeight = 1.0;

        // Add enemy type for grouping behavior
        this.enemyType = this.constructor.name;

        this.sprite = null;
    }

    update(ticker) {
        // Get the list of nearby entities ONCE using the spatial hash.
        const nearby = this.game.spatialHash.getNearby(this);

        // Calculate boids forces - following teacher's approach
        const separation = this.calculateSeparation(nearby);
        const alignment = this.calculateAlignment(nearby);
        const cohesion = this.calculateCohesion(nearby);
        const attack = this.calculatePlayerAttackForce();

        // Sum all forces together
        let totalForce = { x: 0, y: 0 };

        totalForce.x += (separation?.x || 0) * this.separationWeight;
        totalForce.y += (separation?.y || 0) * this.separationWeight;

        totalForce.x += (alignment?.x || 0) * this.alignmentWeight;
        totalForce.y += (alignment?.y || 0) * this.alignmentWeight;

        totalForce.x += (cohesion?.x || 0) * this.cohesionWeight;
        totalForce.y += (cohesion?.y || 0) * this.cohesionWeight;

        totalForce.x += (attack?.x || 0) * this.playerAttackWeight;
        totalForce.y += (attack?.y || 0) * this.playerAttackWeight;

        // Apply the force to velocity
        this.velocity.x += totalForce.x;
        this.velocity.y += totalForce.y;

        // Limit the speed
        const length = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (length > this.speed) {
            this.velocity.x = (this.velocity.x / length) * this.speed;
            this.velocity.y = (this.velocity.y / length) * this.speed;
        }

        super.update(ticker);
    }

    attackPlayerInCell(damage) {
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
        }
    }

    calculateSeparation(nearby) {
        const vecFuerza = { x: 0, y: 0 };

        nearby.forEach((enemy) => {
            // Separate from ALL enemy types, not just same type
            if (enemy instanceof BaseEnemy && enemy !== this) {
                const dx = this.position.x - enemy.position.x;
                const dy = this.position.y - enemy.position.y;
                let distancia = dx * dx + dy * dy;

                // Prevent division by zero and ensure minimum separation
                if (distancia < 1) distancia = 1;

                const dif = {
                    x: dx / distancia,
                    y: dy / distancia,
                };

                vecFuerza.x += dif.x;
                vecFuerza.y += dif.y;
            }
        });

        return vecFuerza;
    }

    calculateAlignment(nearby) {
        const vecPromedio = { x: 0, y: 0 };
        let total = 0;

        nearby.forEach((enemy) => {
            if (
                enemy instanceof BaseEnemy &&
                enemy !== this &&
                enemy.enemyType === this.enemyType
            ) {
                vecPromedio.x += enemy.velocity.x;
                vecPromedio.y += enemy.velocity.y;
                total++;
            }
        });

        if (total > 0) {
            vecPromedio.x /= total;
            vecPromedio.y /= total;
        }

        return vecPromedio;
    }

    calculateCohesion(nearby) {
        const vecPromedio = { x: 0, y: 0 };
        let total = 0;

        nearby.forEach((enemy) => {
            if (
                enemy instanceof BaseEnemy &&
                enemy !== this &&
                enemy.enemyType === this.enemyType
            ) {
                vecPromedio.x += enemy.position.x;
                vecPromedio.y += enemy.position.y;
                total++;
            }
        });

        if (total > 0) {
            vecPromedio.x /= total;
            vecPromedio.y /= total;

            // Create a vector pointing towards the center of mass
            vecPromedio.x = vecPromedio.x - this.position.x;
            vecPromedio.y = vecPromedio.y - this.position.y;
        }

        return vecPromedio;
    }

    calculatePlayerAttackForce() {
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize the direction to the player
        if (distance > 0) {
            return {
                x: (dx / distance) * 0.8, // Scale down to make separation more effective
                y: (dy / distance) * 0.8,
            };
        }
        return { x: 0, y: 0 };
    }
}
