/**
 * A class to implement Spatial Hashing for fast neighbor lookups.
 * It divides the world into a grid and places entities into cells.
 */
export class SpatialHash {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  /**
   * Calculates the grid key for a given world position.
   */
  getKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  /**
   * Adds an entity to the grid.
   */
  add(entity) {
    const key = this.getKey(entity.position.x, entity.position.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key).push(entity);
  }

  /**
   * Gets all entities in the same cell or surrounding cells as the given entity.
   * This is the fast neighbor lookup method.
   */
  getNearby(entity) {
    const nearby = [];
    const x = Math.floor(entity.position.x / this.cellSize);
    const y = Math.floor(entity.position.y / this.cellSize);

    // Check a 3x3 area of cells around the entity's current cell
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const key = `${x + i},${y + j}`;
        if (this.grid.has(key)) {
          nearby.push(...this.grid.get(key));
        }
      }
    }
    return nearby;
  }

  /**
   * Clears the grid. This should be called at the start of each frame.
   */
  clear() {
    this.grid.clear();
  }
}