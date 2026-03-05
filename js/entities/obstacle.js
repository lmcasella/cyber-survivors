import { Entity } from "./entity.js";

export class Obstacle extends Entity {
    constructor(gameManager, x, y, width, height, type = "tree") {
        super(gameManager);

        this.position.x = x;
        this.position.y = y;
        this.width = width;
        this.height = height;
        this.obstacleType = type;
        this.isObstacle = true;

        // Z-index for depth sorting
        this.baseY = y + height; // Bottom of obstacle for sorting

        this.createSprite();

        // Add to pathfinding grid
        this.game.pathfindingGrid.addObstacle(this);
    }

    createSprite() {
        this.sprite = new PIXI.Container();

        switch (this.obstacleType) {
            case "tree":
                this.createTreeSprite();
                break;
            case "rock":
                this.createRockSprite();
                break;
            case "building":
                this.createBuildingSprite();
                break;
            default:
                this.createDefaultSprite();
        }

        this.sprite.position.set(this.position.x, this.position.y);

        // Set z-index for proper depth sorting
        this.updateZIndex();
    }

    createTreeSprite() {
        // Tree trunk (collision area)
        const trunk = new PIXI.Graphics();
        trunk.circle(this.width / 2, this.height - 8, 8);
        trunk.fill(0x8b4513);

        // Tree foliage (visual only)
        const foliage = new PIXI.Graphics();
        foliage.circle(this.width / 2, this.height / 2, this.width / 2);
        foliage.fill(0x228b22);

        // Shadow
        const shadow = new PIXI.Graphics();
        shadow.ellipse(this.width / 2, this.height - 2, this.width / 3, 6);
        shadow.fill({ color: 0x000000, alpha: 0.3 });

        this.sprite.addChild(shadow);
        this.sprite.addChild(foliage);
        this.sprite.addChild(trunk);

        // Collision bounds (smaller than visual)
        this.collisionBounds = {
            x: this.position.x + this.width / 2 - 8,
            y: this.position.y + this.height - 16,
            width: 16,
            height: 16,
        };
    }

    createRockSprite() {
        const rock = new PIXI.Graphics();

        // Main rock
        rock.beginFill(0x696969);
        rock.drawEllipse(
            this.width / 2,
            this.height / 2,
            this.width / 2,
            this.height / 2
        );
        rock.endFill();

        // Highlights
        rock.beginFill(0x808080);
        rock.drawEllipse(
            this.width / 3,
            this.height / 3,
            this.width / 6,
            this.height / 6
        );
        rock.endFill();

        // Shadow
        const shadow = new PIXI.Graphics();
        shadow.ellipse(this.width / 2, this.height - 2, this.width / 2, 4);
        shadow.fill({ color: 0x000000, alpha: 0.4 });

        this.sprite.addChild(shadow);
        this.sprite.addChild(rock);

        // Full collision
        this.collisionBounds = {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
        };
    }

    createBuildingSprite() {
        const building = new PIXI.Graphics();

        // Building body
        building.rect(0, 0, this.width, this.height);
        building.fill(0x8b4513);

        // Roof
        building.rect(0, 0, this.width, this.height / 4);
        building.fill(0x654321);

        // Windows
        building.rect(8, this.height / 3, 8, 8);
        building.fill(0x87ceeb);
        building.rect(this.width - 16, this.height / 3, 8, 8);
        building.fill(0x87ceeb);

        this.sprite.addChild(building);

        // Full collision
        this.collisionBounds = {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
        };
    }

    createDefaultSprite() {
        const graphics = new PIXI.Graphics();
        graphics.rect(0, 0, this.width, this.height);
        graphics.fill(0x654321);
        this.sprite.addChild(graphics);

        this.collisionBounds = {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
        };
    }

    updateZIndex() {
        // Z-index based on bottom Y position for proper depth sorting
        this.sprite.zIndex = this.baseY;
    }

    checkCollision(entity) {
        const entityBounds = entity.getCollisionBounds();
        return this.rectanglesOverlap(entityBounds, this.collisionBounds);
    }

    getCollisionBounds() {
        return this.collisionBounds;
    }

    rectanglesOverlap(rect1, rect2) {
        return !(
            rect1.x + rect1.width < rect2.x ||
            rect2.x + rect2.width < rect1.x ||
            rect1.y + rect1.height < rect2.y ||
            rect2.y + rect2.height < rect1.y
        );
    }

    destroy() {
        this.game.pathfindingGrid.removeObstacle(this);
        this.game.removeEntity(this);
    }
}

export class ObstacleManager {
    constructor(gameManager) {
        this.game = gameManager;
        this.obstacles = [];
    }

    generateWorldObstacles(centerX, centerY) {
        // Create forest area
        this.createForest(centerX + 200, centerY - 150, 15);

        // Create rock field
        this.createRockField(centerX - 200, centerY + 100, 10);

        // Create building cluster
        this.createBuildings(centerX + 300, centerY + 200, 5);

        // Scattered obstacles
        this.createScatteredObstacles(centerX, centerY, 500, 20);

        console.log(`🌳 Generated ${this.obstacles.length} obstacles`);
    }

    createForest(centerX, centerY, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 80;

            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            const size = 32 + Math.random() * 24;
            this.createObstacle(x, y, size, size, "tree");
        }
    }

    createRockField(centerX, centerY, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 60;

            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            const width = 24 + Math.random() * 16;
            const height = 20 + Math.random() * 12;
            this.createObstacle(x, y, width, height, "rock");
        }
    }

    createBuildings(centerX, centerY, count) {
        for (let i = 0; i < count; i++) {
            const x = centerX + (i % 3) * 80 - 80;
            const y = centerY + Math.floor(i / 3) * 60;

            const width = 48 + Math.random() * 32;
            const height = 32 + Math.random() * 24;
            this.createObstacle(x, y, width, height, "building");
        }
    }

    createScatteredObstacles(centerX, centerY, radius, count) {
        const types = ["tree", "rock"];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * (radius - 100);

            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            const type = types[Math.floor(Math.random() * types.length)];
            const size =
                type === "tree"
                    ? 32 + Math.random() * 16
                    : 24 + Math.random() * 12;

            this.createObstacle(x, y, size, size, type);
        }
    }

    createObstacle(x, y, width, height, type) {
        const obstacle = new Obstacle(this.game, x, y, width, height, type);
        this.obstacles.push(obstacle);
        this.game.addEntity(obstacle);
        return obstacle;
    }

    checkCollisionWithObstacles(entity) {
        for (const obstacle of this.obstacles) {
            if (obstacle.checkCollision(entity)) {
                return obstacle;
            }
        }
        return null;
    }

    checkCollisionWithBounds(bounds) {
        for (const obstacle of this.obstacles) {
            if (
                obstacle.rectanglesOverlap(
                    bounds,
                    obstacle.getCollisionBounds()
                )
            ) {
                return true;
            }
        }
        return false;
    }

    removeObstacle(obstacle) {
        const index = this.obstacles.indexOf(obstacle);
        if (index > -1) {
            this.obstacles.splice(index, 1);
            obstacle.destroy();
        }
    }
}
