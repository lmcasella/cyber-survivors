import { PowerUpFactory } from "./powerUpFactory.js";
import { GAME_CONFIG } from "../core/gameConstants.js";

export class PowerUpSpawner {
    constructor(gameManager) {
        this.game = gameManager;
        this.spawnTimer = 0;
        this.spawnInterval = GAME_CONFIG.POWERUPS.SPAWN_INTERVAL;
        this.maxOnScreen = GAME_CONFIG.POWERUPS.MAX_ON_SCREEN;
    }

    update(ticker) {
        this.spawnTimer += ticker.deltaMS;

        if (this.spawnTimer >= this.spawnInterval) {
            this.trySpawnPowerUp();
            this.spawnTimer = 0;
        }
    }

    trySpawnPowerUp() {
        // Check if we have too many powerups already
        const currentPowerUps = this.game.entities.filter((entity) =>
            entity.constructor.name.includes("PowerUp")
        ).length;

        if (currentPowerUps >= this.maxOnScreen) {
            console.log("⏳ Too many powerups on screen, skipping spawn");
            return;
        }

        // Spawn based on current wave (higher waves = better powerups)
        this.spawnWaveBasedPowerUp();
    }

    spawnWaveBasedPowerUp() {
        let powerUpType;

        // Wave-based powerup spawning
        if (this.game.currentWave <= 2) {
            // Early waves: basic powerups
            // powerUpType = Math.random() < 0.7 ? "health" : "pistol";
            powerUpType = "bow";
        } else if (this.game.currentWave <= 5) {
            // Mid waves: introduce better weapons
            const rand = Math.random();
            // if (rand < 0.3) powerUpType = "health";
            // else
            if (rand < 0.5) powerUpType = "bow";
            else if (rand < 0.8) powerUpType = "wand";
            else powerUpType = "speed";
        } else {
            // Late waves: all powerups available
            powerUpType = PowerUpFactory.getRandomType();
        }

        const powerUp = PowerUpFactory.createPowerUp(this.game, powerUpType);
        this.game.addEntity(powerUp);

        console.log(
            `✨ Spawned ${powerUp.name} (Wave ${this.game.currentWave})`
        );
    }

    // Method to spawn specific powerup (useful for testing)
    spawnSpecificPowerUp(type) {
        const powerUp = PowerUpFactory.createPowerUp(this.game, type);
        this.game.addEntity(powerUp);
        console.log(`🎯 Force spawned ${powerUp.name}!`);
    }
}
