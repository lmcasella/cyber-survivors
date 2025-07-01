// No longer importing Application from 'pixi.js'
import { AssetLoader } from "./assetLoader.js";
import { Player } from "./entities/player.js";
import { GruntEnemy } from "./entities/enemy/gruntEnemy.js";
import { FastEnemy } from "./entities/enemy/fastEnemy.js";
import { InputManager } from "./inputManager.js";
import { SpatialHash } from "./core/spatialHash.js";

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

        // Oleada
        this.currentWave = 1;
        this.isSpawningNextWave = false;
        this.enemiesPerWave = {
            grunt: 0,
            fast: 0,
        };
    }

    async init() {
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
        this.spatialHash.clear();
        for (const entity of this.entities) {
            this.spatialHash.add(entity);
        }

        for (const entity of this.entities) {
            entity.update(ticker);
        }

        // Si no hay mas enemigos en la oleada, spawnea la siguiente
        this.checkWaveCompletion();

        this.drawDebugGrid();

        this.world.pivot.copyFrom(this.player.position);
        this.world.position.set(
            this.app.screen.width / 2,
            this.app.screen.height / 2
        );
    }

    drawDebugGrid() {
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

    // Spawnea enemigos lejos del jugador y alrededor
    spawnEnemiesAwayFromPlayer(count, EnemyClass) {
        const minDistance = 10 * this.spatialHash.cellSize;
        const maxDistance = 20 * this.spatialHash.cellSize;

        for (let i = 0; i < count; i++) {
            // Generate random angle and distance
            const angle = Math.random() * Math.PI * 2;
            const distance =
                minDistance + Math.random() * (maxDistance - minDistance);

            // Calculate spawn position in world coordinates
            const spawnX = this.player.position.x + Math.cos(angle) * distance;
            const spawnY = this.player.position.y + Math.sin(angle) * distance;

            // Create enemy
            const enemy = new EnemyClass(
                this,
                this.player,
                this.assets.enemies
            );
            enemy.position.x = spawnX;
            enemy.position.y = spawnY;

            this.addEntity(enemy);
        }

        console.log(`✅ Spawned ${count} ${EnemyClass.name}s around player`);
    }

    // Spawnea oleada
    spawnWave() {
        console.log(`🌊 Starting Wave ${this.currentWave}`);

        const gruntCount = 5 + (this.currentWave - 1) * 3;
        const fastCount = 2 + (this.currentWave - 1) * 2;

        this.spawnEnemiesAwayFromPlayer(gruntCount, GruntEnemy);
        this.spawnEnemiesAwayFromPlayer(fastCount, FastEnemy);

        console.log(
            `Wave ${this.currentWave}: Spawned ${gruntCount} Grunts and ${fastCount} Fast enemies`
        );
    }

    // Checkea si la oleada terminó y spawnea la siguiente
    checkWaveCompletion() {
        // Cantidad de solo enemigos vivos
        const enemyCount = this.entities.filter(
            (entity) =>
                entity instanceof GruntEnemy || entity instanceof FastEnemy
        ).length;

        // Si no quedan enemigos y no estamos spawneando la siguiente oleada
        if (enemyCount === 0 && !this.isSpawningNextWave) {
            this.isSpawningNextWave = true;
            this.currentWave++;

            console.log(
                `🎉 Wave ${this.currentWave - 1} completed! Starting wave ${
                    this.currentWave
                } in 2 seconds...`
            );

            setTimeout(() => {
                this.spawnWave();
                this.isSpawningNextWave = false;
            }, 2000);
        }
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            this.world.removeChild(entity.sprite);
        }
    }
}
