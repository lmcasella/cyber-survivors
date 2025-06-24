// No longer importing Graphics from 'pixi.js'
import { Entity } from '../Entity.js';

export class Enemy extends Entity {
  constructor(gameManager, player) {
    super(gameManager);
    this.player = player;
    this.speed = 2;

    // Use the global PIXI object
    this.sprite = new PIXI.Graphics().circle(0, 0, 10).fill(0xff0000);
    
    this.position.x = Math.random() * this.game.app.screen.width;
    this.position.y = Math.random() * this.game.app.screen.height;
  }

  update(ticker) {
    const dx = this.player.position.x - this.position.x;
    const dy = this.player.position.y - this.position.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > 0) {
        this.velocity.x = (dx / length) * this.speed;
        this.velocity.y = (dy / length) * this.speed;
    }

    super.update(ticker);
  }
}