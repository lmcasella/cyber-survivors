// js/entity/Player.js

import { Entity } from "./entity.js";
import { StateMachine } from "../state-machine/stateMachine.js";
import { IdleState } from "../entities/states/playerStates.js";
import { Projectile } from "./projectile.js"; // Import the Projectile class

export class Player extends Entity {
    constructor(gameManager, playerAssets) {
        super(gameManager);
        this.playerAssets = playerAssets;
        this.speed = 5;
        this.health = 100;
        this.isInvincible = false;

        // Attack properties
        this.attackCooldown = 600; // 300ms between shots
        this.timeSinceLastAttack = 0;
        this.projectileDamage = 25;

        // Use the loaded assets instead of the sheet parameter
        this.sprite = new PIXI.AnimatedSprite(
            this.playerAssets.player.animations.idleDown
        );
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
        // Add this line to increment the attack timer!
        this.timeSinceLastAttack += ticker.deltaMS;

        // First, we determine the player's intended movement from input
        this.handleInput();

        // Handle mouse input for shooting
        this.handleShooting();

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

    handleShooting() {
        const input = this.game.input;

        // Check if mouse was clicked and attack is off cooldown
        if (
            input.wasMouseJustClicked() &&
            this.timeSinceLastAttack >= this.attackCooldown
        ) {
            this.shoot();
            this.timeSinceLastAttack = 0; // Reset cooldown
        }
    }

    shoot() {
        // Get mouse position in screen coordinates
        const mousePos = this.game.input.getMousePosition();

        // Convert screen coordinates to world coordinates
        const worldMousePos = this.screenToWorldPosition(
            mousePos.x,
            mousePos.y
        );

        // Create projectile from player center to mouse position
        const projectile = new Projectile(
            this.game,
            this.position.x, // Start X (player center)
            this.position.y, // Start Y (player center)
            worldMousePos.x, // Target X (mouse in world)
            worldMousePos.y, // Target Y (mouse in world)
            this.projectileDamage
        );

        // Add projectile to game
        this.game.addEntity(projectile);

        console.log(
            `Player shot projectile toward (${worldMousePos.x.toFixed(
                0
            )}, ${worldMousePos.y.toFixed(0)})`
        );
    }

    screenToWorldPosition(screenX, screenY) {
        // Convert screen coordinates to world coordinates
        // Account for camera position (world pivot/position)

        // Screen center
        const screenCenterX = this.game.app.screen.width / 2;
        const screenCenterY = this.game.app.screen.height / 2;

        // Mouse position relative to screen center
        const relativeX = screenX - screenCenterX;
        const relativeY = screenY - screenCenterY;

        // World position = player position + relative mouse position
        return {
            x: this.position.x + relativeX,
            y: this.position.y + relativeY,
        };
    }

    /**
     * Changes the sprite's animation texture array.
     * Prevents restarting the animation if it's already playing.
     */
    playAnimation(animationName) {
        if (this.sprite.currentAnimation === animationName) return;

        this.sprite.textures =
            this.playerAssets.player.animations[animationName];
        this.sprite.currentAnimation = animationName;
        this.sprite.play();
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
