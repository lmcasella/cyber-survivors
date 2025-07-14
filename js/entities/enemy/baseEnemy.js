import { Entity } from "../entity.js";
// import { SpatialHash } from "../../core/spatialHash.js";
// import { WalkState } from "../states/enemiesStates.js";
// import { AttackState } from "../states/enemiesStates.js";
import { StateMachine } from "../../state-machine/stateMachine.js";

export class BaseEnemy extends Entity {
    constructor(gameManager, player, enemyAssets, config) {
        super(gameManager);
        this.player = player;
        this.enemyAssets = enemyAssets;

        // Apply config (set by child classes)
        this.speed = config.speed || 2;
        this.health = config.health || 20;
        this.damage = config.damage || 10;
        this.attackCooldown = config.attackCooldown || 1000;
        this.attackRange = config.attackRange || 50;

        // Boids behavior (customizable per enemy type)
        this.separationWeight = config.separationWeight || 10.0;
        this.alignmentWeight = config.alignmentWeight || 0.2;
        this.cohesionWeight = config.cohesionWeight || 0.02;
        this.playerAttackWeight = config.playerAttackWeight || 1.0;

        // Initialize timing
        this.timeSinceLastAttack = this.attackCooldown;

        // Distance optimization
        this._distanceSquared = Infinity;
        this._lastPlayerPos = { x: -999999, y: -999999 };
        this.distanceToPlayer = Infinity;

        this.position = { x: 0, y: 0 };
        this.enemyType = this.constructor.name;

        this.attackRange = 50;

        // Create sprite (implemented by child classes)
        this.createSprite();

        // Create state machine (implemented by child classes)
        this.createStateMachine();

        // this.position = {
        //     x: 0,
        //     y: 0,
        // };
        // this.sprite.position.copyFrom(this.position);

        // this.stateMachine = new StateMachine(this, this.player);
        // this.stateMachine.setState(new WalkState());
    }

    createSprite() {
        // this.sprite = new PIXI.AnimatedSprite(
        //     this.enemyAssets.demon.animations.walkUp
        // );
        // this.sprite.currentAnimation = "walkUp";
        // this.sprite.animationSpeed = 0.3;
        // this.sprite.play();
    }

    createStateMachine() {
        //
    }

    update(ticker) {
        // Update attack cooldown timer
        this.timeSinceLastAttack += ticker.deltaMS;

        // Trae la lista de entidades cercanas una vez usando el spatial hash
        const nearby = this.game.spatialHash.getNearby(this);
        this.updatePlayerDistanceOptimized();

        this.stateMachine.updateEnemy(ticker, this.player);

        // Apply boids forces
        this.applyBoidsForces(nearby);

        super.update(ticker);
    }

    // Shared boids logic (same for all enemies)
    applyBoidsForces(nearby) {
        const separation = this.calculateSeparation(nearby);
        const alignment = this.calculateAlignment(nearby);
        const cohesion = this.calculateCohesion(nearby);
        const attack = this.calculatePlayerAttackForce();

        let totalForce = { x: 0, y: 0 };

        totalForce.x += (separation?.x || 0) * this.separationWeight;
        totalForce.y += (separation?.y || 0) * this.separationWeight;

        totalForce.x += (alignment?.x || 0) * this.alignmentWeight;
        totalForce.y += (alignment?.y || 0) * this.alignmentWeight;

        totalForce.x += (cohesion?.x || 0) * this.cohesionWeight;
        totalForce.y += (cohesion?.y || 0) * this.cohesionWeight;

        totalForce.x += (attack?.x || 0) * this.playerAttackWeight;
        totalForce.y += (attack?.y || 0) * this.playerAttackWeight;

        // Apply forces to velocity
        this.velocity.x += totalForce.x;
        this.velocity.y += totalForce.y;

        // Limit speed
        const length = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (length > this.speed) {
            this.velocity.x = (this.velocity.x / length) * this.speed;
            this.velocity.y = (this.velocity.y / length) * this.speed;
        }
    }

    updatePlayerDistanceOptimized() {
        // Check if player moved significantly since last calculation
        const playerMoved =
            Math.abs(this.player.position.x - this._lastPlayerPos.x) > 10 ||
            Math.abs(this.player.position.y - this._lastPlayerPos.y) > 10;

        // Only recalculate if player moved or we don't have a cached value
        if (playerMoved || this._distanceSquared === Infinity) {
            const dx = this.player.position.x - this.position.x;
            const dy = this.player.position.y - this.position.y;

            // Store squared distance (avoid sqrt until needed)
            this._distanceSquared = dx * dx + dy * dy;

            // Only calculate actual distance when needed for attack range
            this.distanceToPlayer = Math.sqrt(this._distanceSquared);

            // Cache player position
            this._lastPlayerPos.x = this.player.position.x;
            this._lastPlayerPos.y = this.player.position.y;
        }
    }

    // For attack range checks, use squared distance comparison
    isPlayerInAttackRange() {
        // Compare squared distances (much faster!)
        const attackRangeSquared = this.attackRange * this.attackRange;
        return this._distanceSquared <= attackRangeSquared;
    }

    // Animacion que se usa en state machine
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
    }

    // Atacar la celda donde está el jugador y hacer daño al jugador
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

        // Checkea que ambos estén en la misma celda
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

    // Shared boids calculations
    calculateSeparation(nearby) {
        const vecFuerza = { x: 0, y: 0 };
        let count = 0;

        nearby.forEach((enemy) => {
            if (enemy instanceof BaseEnemy && enemy !== this) {
                const dx = this.position.x - enemy.position.x;
                const dy = this.position.y - enemy.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Only apply separation if enemies are close enough
                const separationRadius = 80; // Adjust this value for desired separation

                if (distance > 0 && distance < separationRadius) {
                    // Normalize the direction vector
                    const normalizedX = dx / distance;
                    const normalizedY = dy / distance;

                    // Stronger force when closer (inverse relationship)
                    const force =
                        (separationRadius - distance) / separationRadius;

                    vecFuerza.x += normalizedX * force;
                    vecFuerza.y += normalizedY * force;
                    count++;
                }
            }
        });

        // Average the force if we found nearby enemies
        if (count > 0) {
            vecFuerza.x /= count;
            vecFuerza.y /= count;
        }

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

            // Normalize the alignment force
            const length = Math.sqrt(
                vecPromedio.x * vecPromedio.x + vecPromedio.y * vecPromedio.y
            );
            if (length > 0) {
                vecPromedio.x /= length;
                vecPromedio.y /= length;
            }
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
            // Calculate center of mass
            vecPromedio.x /= total;
            vecPromedio.y /= total;

            // Calculate vector towards center
            const dx = vecPromedio.x - this.position.x;
            const dy = vecPromedio.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only apply cohesion if not too close and not too far
            const cohesionRadius = 150;
            if (distance > 0 && distance < cohesionRadius) {
                return {
                    x: (dx / distance) * (distance / cohesionRadius),
                    y: (dy / distance) * (distance / cohesionRadius),
                };
            }
        }

        return { x: 0, y: 0 };
    }

    calculatePlayerAttackForce() {
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            return {
                x: (dx / distance) * 0.8,
                y: (dy / distance) * 0.8,
            };
        }
        return { x: 0, y: 0 };
    }

    // Método para recibir daño
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
