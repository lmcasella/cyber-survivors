// No longer importing Application from 'pixi.js'
import { AssetLoader } from "./assetLoader.js";
import { Player } from "./entities/player.js";
import { GruntEnemy } from "./entities/enemy/gruntEnemy.js";
import { FastEnemy } from "./entities/enemy/fastEnemy.js";
import { InputManager } from "./inputManager.js";
import { SpatialHash } from "./core/spatialHash.js";

export class GameManager {
    constructor() {
        // Use the global PIXI object
        this.app = new PIXI.Application();
        this.input = new InputManager();
        this.entities = [];

        this.world = new PIXI.Container();

        this.spatialHash = new SpatialHash(60);

        this.gridGraphics = new PIXI.Graphics();

        this.world.sortableChildren = true;

        this.gridGraphics.zIndex = 1000;

        // Wave system
        this.currentWave = 1;
        this.enemiesPerWave = {
            grunt: 10,
            fast: 5,
        };
    }

    async init() {
        // Use the global PIXI object
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1a1a1a,
        });
        document.body.appendChild(this.app.canvas);
        this.input.init();

        this.app.stage.addChild(this.world);

        this.world.addChild(this.gridGraphics);

        const assets = await AssetLoader.loadAssets();
        const player = new Player(this, assets);
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
        this.spatialHash.clear();
        for (const entity of this.entities) {
            this.spatialHash.add(entity);
        }

        for (const entity of this.entities) {
            entity.update(ticker);
        }

        // Check if wave is complete and spawn next wave
        this.checkWaveCompletion();

        this.drawDebugGrid();

        this.world.pivot.copyFrom(this.player.position);
        this.world.position.set(
            this.app.screen.width / 2,
            this.app.screen.height / 2
        );
    }

    drawDebugGrid() {
        // Clear the previous grid
        this.gridGraphics.clear();

        const cellSize = this.spatialHash.cellSize;
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;

        // Get the top-left corner of the screen in world coordinates
        const viewLeft = this.player.position.x - screenWidth / 2;
        const viewTop = this.player.position.y - screenHeight / 2;

        // Calculate the starting points for drawing lines, snapped to the grid
        const startX = Math.floor(viewLeft / cellSize) * cellSize;
        const startY = Math.floor(viewTop / cellSize) * cellSize;

        // Calculate where the lines should end
        const endX = startX + screenWidth + cellSize;
        const endY = startY + screenHeight + cellSize;

        // Set the line style (color, width, transparency)
        // A dark grey with low transparency works well
        this.gridGraphics.stroke({ color: 0x00ff00, width: 1, alpha: 1.0 });

        // Draw vertical lines
        for (let x = startX; x <= endX; x += cellSize) {
            this.gridGraphics.moveTo(x, startY);
            this.gridGraphics.lineTo(x, endY);
        }

        // Draw horizontal lines
        for (let y = startY; y <= endY; y += cellSize) {
            this.gridGraphics.moveTo(startX, y);
            this.gridGraphics.lineTo(endX, y);
        }
    }

    /**
     * Spawns enemies away from the player's current tile
     * @param {number} count - Number of enemies to spawn
     * @param {class} EnemyClass - The enemy class to instantiate (GruntEnemy, FastEnemy, etc.)
     */
    spawnEnemiesAwayFromPlayer(count, EnemyClass) {
        const playerKey = this.spatialHash.getKey(
            this.player.position.x,
            this.player.position.y
        );

        // Extract player cell coordinates
        const [playerCellX, playerCellY] = playerKey.split(",").map(Number);

        // Minimum distance in cells from player
        const minDistanceInCells = 10;
        const cellSize = this.spatialHash.cellSize;

        for (let i = 0; i < count; i++) {
            let spawnX, spawnY;
            let attempts = 0;
            const maxAttempts = 50;

            do {
                // Generate random position
                spawnX = Math.random() * this.app.screen.width;
                spawnY = Math.random() * this.app.screen.height;

                // Check if spawn position is far enough from player
                const spawnCellX = Math.floor(spawnX / cellSize);
                const spawnCellY = Math.floor(spawnY / cellSize);

                const cellDistance = Math.sqrt(
                    (spawnCellX - playerCellX) ** 2 +
                        (spawnCellY - playerCellY) ** 2
                );

                if (cellDistance >= minDistanceInCells) {
                    break; // Good spawn position found
                }

                attempts++;
            } while (attempts < maxAttempts);

            // If we couldn't find a good position, force spawn at edge of screen
            if (attempts >= maxAttempts) {
                const edge = Math.floor(Math.random() * 4);
                switch (edge) {
                    case 0: // Top
                        spawnX = Math.random() * this.app.screen.width;
                        spawnY = 0;
                        break;
                    case 1: // Right
                        spawnX = this.app.screen.width;
                        spawnY = Math.random() * this.app.screen.height;
                        break;
                    case 2: // Bottom
                        spawnX = Math.random() * this.app.screen.width;
                        spawnY = this.app.screen.height;
                        break;
                    case 3: // Left
                        spawnX = 0;
                        spawnY = Math.random() * this.app.screen.height;
                        break;
                }
            }

            // Create enemy and set position
            const enemy = new EnemyClass(this, this.player);
            enemy.position.x = spawnX;
            enemy.position.y = spawnY;

            this.addEntity(enemy);
        }
    }

    /**
     * Spawns a new wave of enemies
     */
    spawnWave() {
        console.log(`🌊 Starting Wave ${this.currentWave}`);

        // Calculate enemy counts for this wave (can scale with wave number)
        const gruntCount =
            this.enemiesPerWave.grunt + Math.floor(this.currentWave / 2);
        const fastCount =
            this.enemiesPerWave.fast + Math.floor(this.currentWave / 3);

        // Spawn the enemies
        this.spawnEnemiesAwayFromPlayer(gruntCount, GruntEnemy);
        this.spawnEnemiesAwayFromPlayer(fastCount, FastEnemy);

        console.log(
            `Spawned ${gruntCount} Grunt Enemies and ${fastCount} Fast Enemies`
        );
    }

    /**
     * Checks if all enemies are defeated and spawns next wave
     */
    checkWaveCompletion() {
        // Count living enemies (exclude player)
        const enemyCount = this.entities.filter(
            (entity) =>
                entity instanceof GruntEnemy || entity instanceof FastEnemy
        ).length;

        // If no enemies left, spawn next wave
        if (enemyCount === 0) {
            this.currentWave++;

            // Optional: Add delay before next wave
            setTimeout(() => {
                this.spawnWave();
            }, 2000); // 2 second delay
        }
    }

    /**
     * Removes an entity from the game (called when enemy dies)
     */
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            this.world.removeChild(entity.sprite);
        }
    }
}
