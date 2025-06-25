// js/entity/Player.js

import { Entity } from "./entity.js";
import { StateMachine } from "../state-machine/stateMachine.js";
import { IdleState } from "../entities/states/playerStates.js";

export class Player extends Entity {
    constructor(gameManager, sheet) {
        super(gameManager);
        this.sheet = sheet;
        this.speed = 5;
        this.health = 100;
        this.isInvincible = false;

        this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.idleDown);
        this.sprite.animationSpeed = 0.28;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.currentAnimation = "idleDown";
        this.sprite.play();

        this.position = {
            x: this.game.app.screen.width / 2,
            y: this.game.app.screen.height / 2,
        };
        this.sprite.position.copyFrom(this.position);

        this.stateMachine = new StateMachine(this);
        this.stateMachine.setState(new IdleState());
    }

    update(ticker) {
        // First, we determine the player's intended movement from input
        this.handleInput();

        // this.updateAnimation();

        // Then, we let the state machine handle the logic (like changing animations)
        this.stateMachine.update(ticker);

        // Finally, we apply the movement to the player's position
        super.update(ticker);
    }

    handleInput() {
        const input = this.game.input;
        this.velocity = { x: 0, y: 0 };

        // Handle input to set velocity
        if (input.isKeyDown("ArrowUp") || input.isKeyDown("KeyW")) {
            this.velocity.y = -1;
        }
        if (input.isKeyDown("ArrowDown") || input.isKeyDown("KeyS")) {
            this.velocity.y = 1;
        }
        if (input.isKeyDown("ArrowLeft") || input.isKeyDown("KeyA")) {
            this.velocity.x = -1;
        }
        if (input.isKeyDown("ArrowRight") || input.isKeyDown("KeyD")) {
            this.velocity.x = 1;
        }

        // Normalize diagonal movement
        if (this.velocity.x !== 0 && this.velocity.y !== 0) {
            const length = Math.sqrt(
                this.velocity.x ** 2 + this.velocity.y ** 2
            );
            this.velocity.x /= length;
            this.velocity.y /= length;
        }

        this.velocity.x *= this.speed;
        this.velocity.y *= this.speed;
    }

    /**
     * Changes the sprite's animation texture array.
     * Prevents restarting the animation if it's already playing.
     */
    playAnimation(animationName) {
        if (this.sprite.currentAnimation === animationName) return;

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
            if (this.sprite.currentAnimation.startsWith("walk")) {
                this.playAnimation(
                    this.sprite.currentAnimation.replace("walk", "idle")
                );
            }
        }
        // The player is moving
        else {
            // Is the horizontal movement stronger than the vertical movement?
            if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
                if (this.velocity.x > 0) {
                    this.playAnimation("walkRight");
                } else {
                    this.playAnimation("walkLeft");
                }
            }
            // Vertical movement is stronger
            else {
                if (this.velocity.y > 0) {
                    this.playAnimation("walkDown");
                } else {
                    this.playAnimation("walkUp");
                }
            }
        }
    }

    takeDamage(amount) {
        if (this.isInvincible) return;

        this.health -= amount;
        console.log(`Player health: ${this.health}`);

        if (this.health <= 0) {
            console.log("GAME OVER");

            this.sprite.tint = 0x555555;
            this.game.app.ticker.stop();
        }

        this.isInvincible = true;
        this.sprite.tint = 0xff0000;
        setTimeout(() => {
            this.isInvincible = false;
            this.sprite.tint = null;
        }, 1000);
    }
}
