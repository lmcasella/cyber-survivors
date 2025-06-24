import { Entity } from '../entity.js';
import { SpatialHash } from '../../core/spatialHash.js';

export class BaseEnemy extends Entity {
  constructor(gameManager, player) {
    super(gameManager);
    this.player = player;

    this.speed = 2;
    this.health = 10;
    this.neighborRadius = 100;
    this.separationRadius = 100;

    this.separationWeight = 3.5;

    this.alignmentWeight = 1.0;

    this.cohesionWeight = 1.0;

    this.playerAttackWeight = 1.2;

    this.sprite = null;
  }

  update(ticker) {
    // --- The Optimization ---
    // Get the list of nearby entities ONCE using the spatial hash.
    const nearby = this.game.spatialHash.getNearby(this);

    // Pass this short list to the Boids calculations.
    const separation = this.calculateSeparation(nearby);
    const alignment = this.calculateAlignment(nearby);
    const cohesion = this.calculateCohesion(nearby);
    const attack = this.calculatePlayerAttackForce();

    // Apply weights to each force
    separation.x *= this.separationWeight;
    separation.y *= this.separationWeight;
    alignment.x *= this.alignmentWeight;
    alignment.y *= this.alignmentWeight;
    cohesion.x *= this.cohesionWeight;
    cohesion.y *= this.cohesionWeight;
    attack.x *= this.playerAttackWeight;
    attack.y *= this.playerAttackWeight;

    // Add all forces together
    this.velocity.x += separation.x + alignment.x + cohesion.x + attack.x;
    this.velocity.y += separation.y + alignment.y + cohesion.y + attack.y;

    // Limit the speed
    const length = Math.sqrt(this.velocity.x**2 + this.velocity.y**2);
    if (length > this.speed) {
        this.velocity.x = (this.velocity.x / length) * this.speed;
        this.velocity.y = (this.velocity.y / length) * this.speed;
    }

    super.update(ticker);
  }

  // NOTE: The rest of the functions now receive 'nearby' as a parameter.
  // They no longer have to search through all entities in the game.

  calculateSeparation(nearby) {
    let steer = { x: 0, y: 0 };
    for (const entity of nearby) {
        if (entity instanceof BaseEnemy && entity !== this) {
            const dx = this.position.x - entity.position.x;
            const dy = this.position.y - entity.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.separationRadius) {
                steer.x += dx / (distance || 1);
                steer.y += dy / (distance || 1);
            }
        }
    }
    return steer;
  }

  calculateAlignment(nearby) {
    let steer = { x: 0, y: 0 };
    let count = 0;
    for (const entity of nearby) {
      if (entity instanceof BaseEnemy && entity !== this) {
        steer.x += entity.velocity.x;
        steer.y += entity.velocity.y;
        count++;
      }
    }
    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
    }
    return steer;
  }

  calculateCohesion(nearby) {
    let steer = { x: 0, y: 0 };
    let count = 0;
    for (const entity of nearby) {
      if (entity instanceof BaseEnemy && entity !== this) {
        steer.x += entity.position.x;
        steer.y += entity.position.y;
        count++;
      }
    }
    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
      steer.x -= this.position.x;
      steer.y -= this.position.y;
    }
    return steer;
  }

  calculatePlayerAttackForce() {
    const dx = this.player.position.x - this.position.x;
    const dy = this.player.position.y - this.position.y;
    return { x: dx, y: dy };
  }
}