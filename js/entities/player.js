// js/entity/Player.js

import { Entity } from "./entity.js";
import { StateMachine } from "../state-machine/stateMachine.js";
import { IdleState } from "../entities/states/playerStates.js";
import { Projectile } from "./projectile.js"; // Import the Projectile class
import { BowWeapon } from "../weapons/bowWeapon.js";
import { WeaponManager } from "../weapons/weaponManager.js";
import { GAME_CONFIG } from "../core/gameConstants.js";

export class Player extends Entity {
    constructor(gameManager, playerAssets) {
        super(gameManager);
        this.playerAssets = playerAssets;
        // this.speed = 5;
        // this.health = 100;
        // this.isInvincible = false;

        // Base stats from config
        this.baseSpeed = GAME_CONFIG.PLAYER.BASE_SPEED;
        this.speed = this.baseSpeed;
        this.maxHealth = GAME_CONFIG.PLAYER.BASE_HEALTH;
        this.health = this.maxHealth;
        this.isInvincible = false;

        // Weapon system
        this.weaponManager = new WeaponManager();
        this.currentWeapon = new BowWeapon();
        this.timeSinceLastAttack = 0;

        // // Propiedades de ataque
        // this.attackCooldown = 100;
        // this.timeSinceLastAttack = 0;
        // this.projectileDamage = 25;

        // Player stats tracking
        this.stats = {
            enemiesKilled: 0,
            shotsFired: 0,
            powerUpsCollected: 0,
            damageDealt: 0,
            damageTaken: 0,
        };

        // Carga de assets
        this.sprite = new PIXI.AnimatedSprite(
            this.playerAssets.player.animations.idleDown
        );
        this.sprite.animationSpeed = 0.28;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.currentAnimation = "idleDown";
        this.sprite.play();

        // Posicion inicial del jugador
        this.position = {
            x: this.game.app.screen.width / 2,
            y: this.game.app.screen.height / 2,
        };
        this.sprite.position.copyFrom(this.position);

        // Inicializar el estado de la máquina de estados
        this.stateMachine = new StateMachine(this);
        this.stateMachine.setState(new IdleState());
    }

    update(ticker) {
        this.timeSinceLastAttack += ticker.deltaMS;

        // Input movimiento
        this.handleInput();

        // Input mouse para disparar
        this.handleShooting();

        // La máquina de estados maneja la lógica (ej. cambiar animaciones)
        this.stateMachine.update(ticker);

        // Aplica el movimiento a la posición del jugador
        super.update(ticker);

        this.updateVisualFeedback(ticker);
    }

    handleInput() {
        const input = this.game.input;
        this.velocity = { x: 0, y: 0 };

        if (input.isKeyDown("ArrowUp") || input.isKeyDown("KeyW")) {
            this.velocity.y = -1;
        }
        if (input.isKeyDown("ArrowDown") || input.isKeyDown("KeyS")) {
            this.velocity.y = 1;
        }
        if (input.isKeyDown("ArrowLeft") || input.isKeyDown("KeyA")) {
            this.velocity.x = -1;
        }
        if (input.isKeyDown("ArrowRight") || input.isKeyDown("KeyD")) {
            this.velocity.x = 1;
        }

        // Normalizar el movimiento diagonal
        if (this.velocity.x !== 0 && this.velocity.y !== 0) {
            const length = Math.sqrt(
                this.velocity.x ** 2 + this.velocity.y ** 2
            );
            this.velocity.x /= length;
            this.velocity.y /= length;
        }

        this.velocity.x *= this.speed;
        this.velocity.y *= this.speed;
    }

    handleShooting() {
        const input = this.game.input;

        // Check if can shoot
        if (
            input.isMouseDown() &&
            this.timeSinceLastAttack >= this.currentWeapon.cooldown
        ) {
            this.shoot();
        }
    }

    shoot() {
        // Get mouse position in world coordinates
        const mousePos = this.game.input.getMousePosition();
        const worldMousePos = this.screenToWorldPosition(
            mousePos.x,
            mousePos.y
        );

        // Use current weapon's fire method
        this.currentWeapon.fire(this, worldMousePos);

        // Update stats
        this.stats.shotsFired++;
        this.timeSinceLastAttack = 0;
    }

    // Method to switch weapons
    switchWeapon(newWeapon) {
        this.currentWeapon = newWeapon;
        console.log(`🔄 Switched to ${newWeapon.name}!`);

        // Visual feedback
        this.showWeaponSwitchEffect();
    }

    showWeaponSwitchEffect() {
        // Brief color flash to indicate weapon change
        const originalTint = this.sprite.tint;
        this.sprite.tint = this.currentWeapon.color;

        setTimeout(() => {
            if (!this.isInvincible) {
                this.sprite.tint = originalTint;
            }
        }, 200);
    }

    // Convierte las coordenadas de pantalla a coordenadas del mundo (donde esta el jugador)
    screenToWorldPosition(screenX, screenY) {
        // Centro de la pantalla
        const screenCenterX = this.game.app.screen.width / 2;
        const screenCenterY = this.game.app.screen.height / 2;

        // Posición relativa del mouse respecto al centro de la pantalla
        const relativeX = screenX - screenCenterX;
        const relativeY = screenY - screenCenterY;

        // Devuelve las coordenadas del mundo ajustadas a la posición del jugador
        return {
            x: this.position.x + relativeX,
            y: this.position.y + relativeY,
        };
    }

    // Cambiar las texturas de la animación del sprite (se usa en la maquina de estados)
    playAnimation(animationName) {
        if (this.sprite.currentAnimation === animationName) return;

        this.sprite.textures =
            this.playerAssets.player.animations[animationName];
        this.sprite.currentAnimation = animationName;
        this.sprite.play();
    }

    // Take damage method
    takeDamage(amount) {
        if (this.isInvincible) return;

        this.health -= amount;
        this.stats.damageTaken += amount;
        this.game.audioManager.playPlayerDamaged();

        console.log(
            `💔 Player took ${amount} damage! Health: ${this.health}/${this.maxHealth}`
        );

        // Check for game over
        if (this.health <= 0) {
            this.die();
            return;
        }

        // Activate invincibility frames
        this.activateInvincibility();
    }

    // Heal player
    heal(amount) {
        const oldHealth = this.health;
        this.health = Math.min(this.health + amount, this.maxHealth);
        const actualHeal = this.health - oldHealth;

        if (actualHeal > 0) {
            console.log(
                `💚 Player healed ${actualHeal}! Health: ${this.health}/${this.maxHealth}`
            );
            this.showHealEffect();
        }

        return actualHeal;
    }

    // Increase speed
    increaseSpeed(amount) {
        const maxSpeed = GAME_CONFIG.PLAYER.MAX_PLAYER_SPEED || 10;
        if (this.speed < maxSpeed) {
            this.speed = Math.min(this.speed + amount, maxSpeed);
            console.log(
                `⚡ Speed increased! New speed: ${this.speed.toFixed(1)}`
            );
            return true;
        }
        console.log(`⚡ Already at maximum speed!`);
        return false;
    }

    activateInvincibility() {
        this.isInvincible = true;
        this.sprite.tint = GAME_CONFIG.PLAYER.DAMAGE_TINT;

        setTimeout(() => {
            this.isInvincible = false;
            this.sprite.tint = 0xffffff; // Reset to normal
        }, GAME_CONFIG.PLAYER.INVINCIBILITY_TIME);
    }

    showHealEffect() {
        // Brief green flash for healing
        const originalTint = this.sprite.tint;
        this.sprite.tint = 0x00ff00;

        setTimeout(() => {
            if (!this.isInvincible) {
                this.sprite.tint = originalTint;
            }
        }, 300);
    }

    updateVisualFeedback(ticker) {
        // Could add breathing effect, weapon glow, etc.
        if (this.currentWeapon && this.timeSinceLastAttack < 100) {
            // Brief weapon fire effect
        }
    }

    die() {
        console.log("💀 GAME OVER");
        console.log("📊 Final Stats:", this.stats);

        this.sprite.tint = 0x555555;
        this.game.gameOver();
    }

    // Get current weapon info for UI
    getWeaponInfo() {
        return {
            name: this.currentWeapon.name,
            damage: this.currentWeapon.damage,
            cooldown: this.currentWeapon.cooldown,
            cooldownProgress:
                this.timeSinceLastAttack / this.currentWeapon.cooldown,
        };
    }

    // Get player stats for UI
    getStats() {
        return {
            health: this.health,
            maxHealth: this.maxHealth,
            speed: this.speed,
            weapon: this.currentWeapon.name,
            ...this.stats,
        };
    }
}
