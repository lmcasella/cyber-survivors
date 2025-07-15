export class PathfindingGrid {
    constructor(cellSize = 32) {
        this.cellSize = cellSize;
        this.obstacles = new Map(); // key: "x,y", value: obstacle reference
    }

    getGridKey(worldX, worldY) {
        const gridX = Math.floor(worldX / this.cellSize);
        const gridY = Math.floor(worldY / this.cellSize);
        return `${gridX},${gridY}`;
    }

    worldToGrid(worldX, worldY) {
        return {
            x: Math.floor(worldX / this.cellSize),
            y: Math.floor(worldY / this.cellSize),
        };
    }

    gridToWorld(gridX, gridY) {
        return {
            x: gridX * this.cellSize + this.cellSize / 2,
            y: gridY * this.cellSize + this.cellSize / 2,
        };
    }

    addObstacle(obstacle) {
        // Add multiple grid cells for the obstacle bounds
        const startX = Math.floor(obstacle.position.x / this.cellSize);
        const startY = Math.floor(obstacle.position.y / this.cellSize);
        const endX = Math.floor(
            (obstacle.position.x + obstacle.width) / this.cellSize
        );
        const endY = Math.floor(
            (obstacle.position.y + obstacle.height) / this.cellSize
        );

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const key = `${x},${y}`;
                this.obstacles.set(key, obstacle);
            }
        }
    }

    removeObstacle(obstacle) {
        // Remove all grid cells for this obstacle
        const keysToRemove = [];
        for (const [key, obs] of this.obstacles) {
            if (obs === obstacle) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach((key) => this.obstacles.delete(key));
    }

    isWalkable(gridX, gridY) {
        const key = `${gridX},${gridY}`;
        return !this.obstacles.has(key);
    }

    getNeighbors(gridX, gridY) {
        const neighbors = [];
        const directions = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
        ];

        for (const [dx, dy] of directions) {
            const newX = gridX + dx;
            const newY = gridY + dy;

            if (this.isWalkable(newX, newY)) {
                neighbors.push({
                    x: newX,
                    y: newY,
                    cost: dx !== 0 && dy !== 0 ? 1.414 : 1,
                });
            }
        }

        return neighbors;
    }
}

export class AStarPathfinder {
    constructor(grid, obstacleManager) {
        this.grid = grid;
        this.obstacleManager = obstacleManager;
    }

    heuristic(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    findPath(startWorld, goalWorld, entityRadius = 15) {
        const start = this.grid.worldToGrid(startWorld.x, startWorld.y);
        let goal = this.grid.worldToGrid(goalWorld.x, goalWorld.y);

        // Check if goal is blocked by sprite collision
        if (this.isPositionBlocked(goalWorld.x, goalWorld.y, entityRadius)) {
            const nearestGoal = this.findNearestWalkable(
                goalWorld,
                entityRadius
            );
            if (!nearestGoal) return [];
            goal = this.grid.worldToGrid(nearestGoal.x, nearestGoal.y);
        }

        const openSet = [start];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        gScore.set(`${start.x},${start.y}`, 0);
        fScore.set(`${start.x},${start.y}`, this.heuristic(start, goal));

        while (openSet.length > 0) {
            let current = openSet[0];
            let currentIndex = 0;

            for (let i = 1; i < openSet.length; i++) {
                const currentKey = `${openSet[i].x},${openSet[i].y}`;
                const bestKey = `${current.x},${current.y}`;
                if (fScore.get(currentKey) < fScore.get(bestKey)) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }

            openSet.splice(currentIndex, 1);
            closedSet.add(`${current.x},${current.y}`);

            if (current.x === goal.x && current.y === goal.y) {
                return this.reconstructPath(cameFrom, current);
            }

            const neighbors = this.getValidNeighbors(
                current.x,
                current.y,
                entityRadius
            );

            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;

                if (closedSet.has(neighborKey)) continue;

                const tentativeGScore =
                    gScore.get(`${current.x},${current.y}`) + neighbor.cost;

                if (
                    !openSet.find(
                        (n) => n.x === neighbor.x && n.y === neighbor.y
                    )
                ) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= gScore.get(neighborKey)) {
                    continue;
                }

                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(
                    neighborKey,
                    tentativeGScore + this.heuristic(neighbor, goal)
                );
            }
        }

        return [];
    }

    getValidNeighbors(gridX, gridY, entityRadius) {
        const neighbors = [];
        const directions = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
        ];

        for (const [dx, dy] of directions) {
            const newX = gridX + dx;
            const newY = gridY + dy;

            const worldPos = this.grid.gridToWorld(newX, newY);

            if (!this.isPositionBlocked(worldPos.x, worldPos.y, entityRadius)) {
                neighbors.push({
                    x: newX,
                    y: newY,
                    cost: dx !== 0 && dy !== 0 ? 1.414 : 1,
                });
            }
        }

        return neighbors;
    }

    isPositionBlocked(worldX, worldY, entityRadius) {
        if (!this.obstacleManager) return false;

        const testBounds = {
            x: worldX - entityRadius,
            y: worldY - entityRadius,
            width: entityRadius * 2,
            height: entityRadius * 2,
        };

        return this.obstacleManager.checkCollisionWithBounds(testBounds);
    }

    findNearestWalkable(target, entityRadius, maxRadius = 80) {
        for (let radius = entityRadius * 2; radius <= maxRadius; radius += 10) {
            const points = 8;
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const x = target.x + Math.cos(angle) * radius;
                const y = target.y + Math.sin(angle) * radius;

                if (!this.isPositionBlocked(x, y, entityRadius)) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        let currentKey = `${current.x},${current.y}`;

        while (cameFrom.has(currentKey)) {
            current = cameFrom.get(currentKey);
            path.unshift(current);
            currentKey = `${current.x},${current.y}`;
        }

        return path.map((gridPos) =>
            this.grid.gridToWorld(gridPos.x, gridPos.y)
        );
    }
}
