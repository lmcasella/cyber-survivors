// js/entity/Player.js

import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor(gameManager, sheet) {
    super(gameManager);
    this.sheet = sheet;
    this.speed = 5;

    this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.idleDown);
    this.sprite.animationSpeed = 0.15;
    this.sprite.anchor.set(0.5, 1.0);
    this.sprite.currentAnimation = 'idleDown';
    this.sprite.play();
    
    this.position = { x: this.game.app.screen.width / 2, y: this.game.app.screen.height / 2 };
    this.sprite.position.copyFrom(this.position);
  }

  update(ticker) {
    const input = this.game.input;
    this.velocity = { x: 0, y: 0 };

    // Handle input to set velocity
    if (input.isKeyDown('ArrowUp') || input.isKeyDown('KeyW')) {
        this.velocity.y = -1;
    }
    if (input.isKeyDown('ArrowDown') || input.isKeyDown('KeyS')) {
        this.velocity.y = 1;
    }
    if (input.isKeyDown('ArrowLeft') || input.isKeyDown('KeyA')) {
        this.velocity.x = -1;
    }
    if (input.isKeyDown('ArrowRight') || input.isKeyDown('KeyD')) {
        this.velocity.x = 1;
    }

    // Normalize diagonal movement
    if (this.velocity.x !== 0 && this.velocity.y !== 0) {
        const length = Math.sqrt(this.velocity.x**2 + this.velocity.y**2);
        this.velocity.x /= length;
        this.velocity.y /= length;
    }
    
    this.velocity.x *= this.speed;
    this.velocity.y *= this.speed;

    // This function is called every frame to set the correct animation
    this.updateAnimation();

    // Call the base class update to apply movement
    super.update(ticker);
  }
  
  /**
   * Changes the sprite's animation texture array.
   * Prevents restarting the animation if it's already playing.
   */
  playAnimation(animationName) {
    if (this.sprite.currentAnimation === animationName) {
        return; // Do nothing if we're already playing this animation
    }

    this.sprite.textures = this.sheet.animations[animationName];
    this.sprite.currentAnimation = animationName;
    this.sprite.play();
  }

  /**
   * Checks the player's velocity and calls playAnimation with the correct animation name.
   */
  updateAnimation() {
      // Check if the player is idle
      if (this.velocity.x === 0 && this.velocity.y === 0) {
          // If we were walking, switch to the corresponding idle animation
          if (this.sprite.currentAnimation.startsWith('walk')) {
              this.playAnimation(this.sprite.currentAnimation.replace('walk', 'idle'));
          }
      } 
      // The player is moving
      else {
          // Is the horizontal movement stronger than the vertical movement?
          if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
              if (this.velocity.x > 0) {
                  this.playAnimation('walkRight');
              } else {
                  this.playAnimation('walkLeft');
              }
          } 
          // Vertical movement is stronger
          else {
              if (this.velocity.y > 0) {
                  this.playAnimation('walkDown');
              } else {
                  this.playAnimation('walkUp');
              }
          }
      }
  }
}