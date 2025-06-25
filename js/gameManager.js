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

        this.spatialHash = new SpatialHash(70);

        this.gridGraphics = new PIXI.Graphics();

        this.world.sortableChildren = true;

        this.gridGraphics.zIndex = 1000;
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

        // Spawn 10 Grunt Enemies
        for (let i = 0; i < 10; i++) {
            this.addEntity(new GruntEnemy(this, player));
        }

        // Spawn 5 Fast Enemies
        for (let i = 0; i < 5; i++) {
            this.addEntity(new FastEnemy(this, player));
        }

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
}
