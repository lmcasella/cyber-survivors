import { Entity } from "../entity.js";
import { SpatialHash } from "../../core/spatialHash.js";
import { WalkState } from "../states/enemiesStates.js";
import { AttackState } from "../states/enemiesStates.js";
import { StateMachine } from "../../state-machine/stateMachine.js";

export class BaseEnemy extends Entity {
    constructor(gameManager, player, enemyAssets) {
        super(gameManager);
        this.player = player;
        this.enemyAssets = enemyAssets;

        this.speed = 2;
        this.health = 10;
        this.damage;

        this.attackCooldown = 1000;
        this.timeSinceLastAttack = this.attackCooldown;
        this.sprite = new PIXI.AnimatedSprite(
            this.enemyAssets.demon.animations.walkUp
        );
        this.sprite.currentAnimation = "walkUp";
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();

        this.position = {
            x: 0,
            y: 0,
        };
        this.sprite.position.copyFrom(this.position);

        this.attackRange = 50;
        this.distanceToPlayer = Infinity;

        // Boids variables
        this.neighborRadius;
        this.separationWeight;
        this.alignmentWeight;
        this.cohesionWeight;
        this.playerAttackWeight;

        // Add enemy type for grouping behavior
        this.enemyType = this.constructor.name;

        this.stateMachine = new StateMachine(this, this.player);
        this.stateMachine.setState(new WalkState());
    }

    update(ticker) {
        // Update attack cooldown timer
        this.timeSinceLastAttack += ticker.deltaMS;

        // Get the list of nearby entities ONCE using the spatial hash.
        const nearby = this.game.spatialHash.getNearby(this);

        this.updatePlayerDistance();
        // this.updateState();

        this.stateMachine.updateEnemy(ticker, this.player);

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

        // // Handle attacking
        // if (this.currentState === this.states.ATTACKING) {
        //     this.attackPlayerInCell();
        // }

        // Update animations
        // this.updateAnimation();

        super.update(ticker);
    }

    updatePlayerDistance() {
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        this.distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
    }

    playAnimation(animationName) {
        if (this.sprite.currentAnimation === animationName) return;

        try {
            if (this.enemyAssets.demon.animations[animationName]) {
                this.sprite.textures =
                    this.enemyAssets.demon.animations[animationName];
                this.sprite.currentAnimation = animationName;
                this.sprite.play();
            }
        } catch (error) {
            // Ignore animation errors
        }
        // this.sprite.textures = this.enemyAssets.demon.animations[animationName];
        // this.sprite.currentAnimation = animationName;
        // this.sprite.play();
    }

    attackPlayerInCell() {
        console.log("BaseEnemy attackPlayerInCell called");

        if (this.timeSinceLastAttack < this.attackCooldown) return false;

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
                `${this.enemyType} attacked player for ${this.damage} damage!`
            );
            return true;
        }
        return false;
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
        const dx = this.player.position.x - this.sprite.position.x;
        const dy = this.player.position.y - this.sprite.position.y;
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

    takeDamage(amount) {
        this.health -= amount;
        console.log(
            `${this.enemyType} took ${amount} damage! Health: ${this.health}`
        );

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log(`${this.enemyType} died!`);
        this.game.removeEntity(this);
    }
}
