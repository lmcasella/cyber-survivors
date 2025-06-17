export class Entity {
  constructor(gameManager) {
    this.game = gameManager;
    this.sprite = null; // Will be created by subclasses
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
  }

  update(ticker) {
    // Basic physics: position += velocity * deltaTime
    this.position.x += this.velocity.x * ticker.deltaTime;
    this.position.y += this.velocity.y * ticker.deltaTime;

    // Sync sprite position
    if (this.sprite) {
      this.sprite.position.copyFrom(this.position);
    }
  }

  destroy() {
    this.game.world.removeChild(this.sprite);
  }
}