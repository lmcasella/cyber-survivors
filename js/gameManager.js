// No longer importing Application from 'pixi.js'
import * as PIXI from "https://cdn.skypack.dev/pixi.js@8.0.0";
import { AssetLoader } from "./assetLoader.js";
import { Player } from "./entities/player.js";
import { GruntEnemy } from "./entities/enemy/gruntEnemy.js";
import { FastEnemy } from "./entities/enemy/fastEnemy.js";
import { BossEnemy } from "./entities/enemy/bossEnemy.js";
import { InputManager } from "./inputManager.js";
import { SpatialHash } from "./core/spatialHash.js";
import { PowerUpFactory } from "./powerups/powerUpFactory.js";
import { PowerUpSpawner } from "./powerups/powerUpSpawner.js";
import { GAME_CONFIG } from "./core/gameConstants.js";
import { BaseEnemy } from "./entities/enemy/baseEnemy.js";

// import { TilingSprite } from "./pixi.js";
// import * as PIXI from "./pixi.js";

export class GameManager {
    constructor() {
        this.app = new PIXI.Application();
        this.input = new InputManager();
        this.entities = [];

        this.world = new PIXI.Container();

        this.spatialHash = new SpatialHash(55);

        this.gridGraphics = new PIXI.Graphics();

        this.world.sortableChildren = true;

        this.gridGraphics.zIndex = 1000;

        // Game state
        this.gameState = "playing"; // 'playing', 'paused', 'gameOver'
        this.currentWave = 1;
        this.isSpawningNextWave = false;

        // PowerUp system
        this.powerUpSpawner = new PowerUpSpawner(this);

        // Game stats
        this.gameStats = {
            startTime: Date.now(),
            waveStartTime: Date.now(),
            totalEnemiesSpawned: 0,
            totalEnemiesKilled: 0,
        };

        // // Oleada
        // this.currentWave = 1;
        // this.isSpawningNextWave = false;
        // this.enemiesPerWave = {
        //     grunt: 0,
        //     fast: 0,
        // };

        // this.powerUpSpawnTimer = 0;
        // this.powerUpSpawnInterval = GAME_CONFIG.POWERUPS.SPAWN_INTERVAL;
        // this.maxPowerUpsOnScreen = GAME_CONFIG.POWERUPS.MAX_ON_SCREEN;
    }

    async createBackground(app) {
        const texture = await PIXI.Assets.get("assets/images/bg.png");

        const background = new PIXI.TilingSprite({
            texture,
            width: app.screen.width * 4,
            height: app.screen.height * 4,
        });

        this.world.addChild(background);
    }

    async init() {
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1a1a1a,
        });

        await PIXI.Assets.load(["assets/images/bg.png"]);

        this.background = await this.createBackground(this.app);

        document.body.appendChild(this.app.canvas);
        this.input.init();

        this.app.stage.addChild(this.world);

        this.world.addChild(this.gridGraphics);

        const assets = await AssetLoader.loadAssets();
        this.assets = assets;

        const player = new Player(this, assets.player);
        this.player = player;
        this.addEntity(player);

        // Start the first wave
        this.spawnWave();

        this.app.ticker.add((ticker) => this.update(ticker));
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.world.addChild(entity.sprite);
    }

    update(ticker) {
        if (this.gameState !== "playing") return;

        // Update spatial hash
        this.spatialHash.clear();
        for (const entity of this.entities) {
            this.spatialHash.add(entity);
        }

        // Update all entities
        for (const entity of this.entities) {
            entity.update(ticker);
        }

        // Update systems
        this.powerUpSpawner.update(ticker);
        this.checkWaveCompletion();

        // Update camera
        this.updateCamera();

        // Draw debug information
        if (GAME_CONFIG.DEBUG.SHOW_GRID) {
            // this.drawDebugGrid();
        }
    }

    updateCamera() {
        // Center camera on player
        this.world.pivot.copyFrom(this.player.position);
        this.world.position.set(
            this.app.screen.width / 2,
            this.app.screen.height / 2
        );
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.world.addChild(entity.sprite);
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            if (entity.sprite && entity.sprite.parent) {
                this.world.removeChild(entity.sprite);
            }
        }
    }

    spawnWave() {
        console.log(`🌊 Starting Wave ${this.currentWave}`);
        this.gameStats.waveStartTime = Date.now();

        // Check if this is a boss wave
        const isBossWave = GAME_CONFIG.WAVES.BOSS_WAVES.includes(
            this.currentWave
        );

        if (isBossWave) {
            // Boss wave - spawn only the boss
            console.log(
                `👹 BOSS WAVE ${this.currentWave}! Preparing boss encounter...`
            );

            this.spawnBoss();

            // Update stats (count boss as 1 enemy)
            this.gameStats.totalEnemiesSpawned += 1;
        } else {
            // Regular wave - spawn normal enemies
            const baseGrunts = GAME_CONFIG.ENEMIES.GRUNT_BASE_COUNT;
            const baseFast = GAME_CONFIG.ENEMIES.FAST_BASE_COUNT;
            const gruntMultiplier = GAME_CONFIG.ENEMIES.GRUNT_WAVE_MULTIPLIER;
            const fastMultiplier = GAME_CONFIG.ENEMIES.FAST_WAVE_MULTIPLIER;

            const gruntCount =
                baseGrunts + (this.currentWave - 1) * gruntMultiplier;
            const fastCount = Math.floor(
                baseFast + (this.currentWave - 1) * fastMultiplier
            );

            // Spawn regular enemies
            this.spawnEnemiesAwayFromPlayer(gruntCount, GruntEnemy);
            this.spawnEnemiesAwayFromPlayer(fastCount, FastEnemy);

            // Update stats
            this.gameStats.totalEnemiesSpawned += gruntCount + fastCount;

            console.log(
                `📊 Wave ${
                    this.currentWave
                }: ${gruntCount} Grunts + ${fastCount} Fast = ${
                    gruntCount + fastCount
                } total enemies`
            );
        }

        // Handle other special wave events (if any)
        this.handleSpecialWaveEvents();
    }

    spawnBoss() {
        console.log(`🦹 Spawning Boss for Wave ${this.currentWave}!`);

        // Spawn boss at a specific distance from player
        const angle = Math.random() * Math.PI * 2;
        const distance = 400; // Fixed distance for dramatic entrance

        const spawnX = this.player.position.x + Math.cos(angle) * distance;
        const spawnY = this.player.position.y + Math.sin(angle) * distance;

        // Create boss enemy
        // const boss = new BossEnemy(this, this.player, this.assets.enemies);

        this.spawnEnemiesAwayFromPlayer(1, BossEnemy);

        // boss.position.x = spawnX;
        // boss.position.y = spawnY;

        // Scale boss for wave (make it extra strong)
        // this.scaleBossForWave(boss);

        // this.addEntity(boss);

        console.log(
            `👑 Boss spawned at (${spawnX.toFixed(0)}, ${spawnY.toFixed(0)})`
        );
    }

    scaleBossForWave(boss) {
        const wave = this.currentWave;

        // Boss gets stronger scaling than regular enemies
        const bossHealthMultiplier =
            GAME_CONFIG.ENEMIES.HEALTH_SCALE_PER_WAVE * 1.5; // 50% more health scaling
        const bossDamageMultiplier =
            GAME_CONFIG.ENEMIES.DAMAGE_SCALE_PER_WAVE * 1.3; // 30% more damage scaling
        const bossSpeedMultiplier =
            GAME_CONFIG.ENEMIES.SPEED_SCALE_PER_WAVE * 1.1; // 10% more speed scaling

        boss.health = Math.floor(
            boss.health * Math.pow(bossHealthMultiplier, wave - 1)
        );
        boss.damage = Math.floor(
            boss.damage * Math.pow(bossDamageMultiplier, wave - 1)
        );
        boss.speed = boss.speed * Math.pow(bossSpeedMultiplier, wave - 1);

        console.log(
            `💪 Boss scaled for Wave ${wave}: Health=${boss.health}, Damage=${
                boss.damage
            }, Speed=${boss.speed.toFixed(1)}`
        );
    }

    handleSpecialWaveEvents() {
        // Powerup waves - guaranteed powerup
        if (GAME_CONFIG.WAVES.POWERUP_WAVES.includes(this.currentWave)) {
            console.log(
                `🎁 POWERUP WAVE ${this.currentWave}! Bonus items incoming!`
            );
            setTimeout(() => {
                this.powerUpSpawner.spawnSpecificPowerUp("health");
                this.powerUpSpawner.spawnSpecificPowerUp("speed");
            }, 2000);
        }
    }

    spawnEnemiesAwayFromPlayer(count, EnemyClass) {
        const minDistance =
            GAME_CONFIG.ENEMIES.SPAWN_DISTANCE_MIN * this.spatialHash.cellSize;
        const maxDistance =
            GAME_CONFIG.ENEMIES.SPAWN_DISTANCE_MAX * this.spatialHash.cellSize;

        for (let i = 0; i < count; i++) {
            // Random spawn position around player
            const angle = Math.random() * Math.PI * 2;
            const distance =
                minDistance + Math.random() * (maxDistance - minDistance);

            const spawnX = this.player.position.x + Math.cos(angle) * distance;
            const spawnY = this.player.position.y + Math.sin(angle) * distance;

            // Create enemy with wave scaling
            const enemy = new EnemyClass(
                this,
                this.player,
                this.assets.enemies
            );
            enemy.position.x = spawnX;
            enemy.position.y = spawnY;

            // Scale enemy stats based on wave
            this.scaleEnemyForWave(enemy);

            this.addEntity(enemy);
        }

        if (GAME_CONFIG.DEBUG.LOG_SPAWNS) {
            console.log(
                `✅ Spawned ${count} ${EnemyClass.name}s around player`
            );
        }
    }

    scaleEnemyForWave(enemy) {
        const wave = this.currentWave;

        // Scale health, damage, and speed based on wave
        enemy.health = Math.floor(
            enemy.health *
                Math.pow(GAME_CONFIG.ENEMIES.HEALTH_SCALE_PER_WAVE, wave - 1)
        );
        enemy.damage = Math.floor(
            enemy.damage *
                Math.pow(GAME_CONFIG.ENEMIES.DAMAGE_SCALE_PER_WAVE, wave - 1)
        );
        enemy.speed =
            enemy.speed *
            Math.pow(GAME_CONFIG.ENEMIES.SPEED_SCALE_PER_WAVE, wave - 1);
    }

    checkWaveCompletion() {
        // Count living enemies
        const enemyCount = this.entities.filter(
            (entity) =>
                // entity instanceof BossEnemy ||
                // entity instanceof GruntEnemy ||
                // entity instanceof FastEnemy
                entity instanceof BaseEnemy
        ).length;

        // If no enemies left and not already spawning next wave
        if (enemyCount === 0 && !this.isSpawningNextWave) {
            this.completeWave();
        }
    }

    completeWave() {
        this.isSpawningNextWave = true;

        const waveTime = Date.now() - this.gameStats.waveStartTime;
        console.log(
            `🎉 Wave ${this.currentWave} completed in ${(
                waveTime / 1000
            ).toFixed(1)}s!`
        );

        this.currentWave++;

        // Check for game victory
        if (this.currentWave > GAME_CONFIG.WAVES.VICTORY_WAVE) {
            this.gameVictory();
            return;
        }

        // Delay before next wave
        setTimeout(() => {
            this.spawnWave();
            this.isSpawningNextWave = false;
        }, GAME_CONFIG.WAVES.COMPLETION_DELAY);
    }

    drawDebugGrid() {
        this.gridGraphics.clear();

        const cellSize = this.spatialHash.cellSize;
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;

        const viewLeft = this.player.position.x - screenWidth / 2;
        const viewTop = this.player.position.y - screenHeight / 2;

        const startX = Math.floor(viewLeft / cellSize) * cellSize;
        const startY = Math.floor(viewTop / cellSize) * cellSize;
        const endX = startX + screenWidth + cellSize;
        const endY = startY + screenHeight + cellSize;

        this.gridGraphics.stroke({
            color: GAME_CONFIG.GRAPHICS.GRID_COLOR,
            width: 1,
            alpha: GAME_CONFIG.GRAPHICS.GRID_ALPHA,
        });

        // Draw grid lines
        for (let x = startX; x <= endX; x += cellSize) {
            this.gridGraphics.moveTo(x, startY);
            this.gridGraphics.lineTo(x, endY);
        }

        for (let y = startY; y <= endY; y += cellSize) {
            this.gridGraphics.moveTo(startX, y);
            this.gridGraphics.lineTo(endX, y);
        }
    }

    gameOver() {
        this.gameState = "gameOver";
        this.app.ticker.stop();

        const totalTime = Date.now() - this.gameStats.startTime;

        console.log("💀 GAME OVER!");
        console.log(`📊 Final Stats:`);
        console.log(`   Wave reached: ${this.currentWave}`);
        console.log(
            `   Time played: ${(totalTime / 1000 / 60).toFixed(1)} minutes`
        );
        console.log(
            `   Enemies spawned: ${this.gameStats.totalEnemiesSpawned}`
        );
        console.log(`   Enemies killed: ${this.gameStats.totalEnemiesKilled}`);
        console.log(`   Player stats:`, this.player.getStats());
    }

    gameVictory() {
        this.gameState = "victory";

        const totalTime = Date.now() - this.gameStats.startTime;

        console.log("🎊 VICTORY! You completed all waves!");
        console.log(
            `🏆 Final completion time: ${(totalTime / 1000 / 60).toFixed(
                1
            )} minutes`
        );
        console.log(`📊 Final stats:`, this.player.getStats());

        // Could show victory screen here
    }

    pauseGame() {
        this.gameState = "paused";
        console.log("⏸️ Game paused");
    }

    resumeGame() {
        this.gameState = "playing";
        console.log("▶️ Game resumed");
    }

    // Utility methods
    getWaveInfo() {
        return {
            current: this.currentWave,
            enemiesAlive: this.entities.filter(
                (e) =>
                    // e instanceof BossEnemy ||
                    // e instanceof GruntEnemy ||
                    // e instanceof FastEnemy
                    e instanceof BaseEnemy
            ).length,
            isSpawning: this.isSpawningNextWave,
        };
    }

    getGameStats() {
        return {
            ...this.gameStats,
            currentWave: this.currentWave,
            gameTime: Date.now() - this.gameStats.startTime,
            playerStats: this.player.getStats(),
        };
    }
}
