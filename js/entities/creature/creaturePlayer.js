import { AnimatedSprite } from 'pixi.js';
import { Creature } from './creature.js';
import { GameUtils } from '../../core/utils.js';

export class CreaturePlayer extends Creature {
    constructor(gameManager, sheet) {
        super(gameManager); // This calls Creature's constructor, which creates segments and adds them to world.

        // Remove segments created by the parent class, keeping only the head (this)
        // We iterate from 1 to keep the first segment (the player's head)
        for (let i = 1; i < this.segments.length; i++) {
            const segmentToRemove = this.segments[i];
            // Check if the segment's sprite exists and is a child of the world container before attempting to remove
            if (segmentToRemove.sprite && this.gameManager.world.contains(segmentToRemove.sprite)) {
                this.gameManager.world.removeChild(segmentToRemove.sprite);
            }
            // Remove debug shapes associated with segments if they exist
            if (segmentToRemove.debugShape && this.gameManager.world.contains(segmentToRemove.debugShape)) {
                this.gameManager.world.removeChild(segmentToRemove.debugShape);
            }
        }
        this.segments = [this]; // Reset segments array to only contain the player head

        // Now, set up the human player sprite using the provided spritesheet
        this.sheet = sheet;
        this.currentAnimation = 'idleDown'; // Default animation state
        this.sprite = new PIXI.AnimatedSprite(this.sheet.animations[this.currentAnimation]);
        
        this.sprite.animationSpeed = 0.15;
        this.sprite.play();
        this.sprite.anchor.set(0.5, 1); // Adjust anchor for proper positioning relative to feet
        
        // Initial position for the player
        this.position = { x: 300, y: 300 };
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    }

    // Override methods to prevent the player from adding or splitting segments
    addNewSegment() {
        console.log("Player cannot add segments.");
    }

    splitSegmentAtIndex(id) {
        console.log("Player cannot split segments.");
    }

    onKeyDown(event) {
        this.keysPressed[event.key] = true;
    }

    onKeyUp(event) {
        this.keysPressed[event.key] = false;
    }

    // This method is not used in the current player movement logic.
    // onKeyPressed(event) {
    //     let movementInput = 0;
    //     let positionToMove = this.desiredPosition + movementInput;
    //     this.desiredPosition = positionToMove;
    // }

    update(ticker) {
        const keys = this.gameManager.keysPressed;
        const left = keys["ArrowLeft"] ? -1 : 0;
        const right = keys["ArrowRight"] ? 1 : 0;
        const up = keys["ArrowUp"] ? -1 : 0;
        const down = keys["ArrowDown"] ? 1 : 0;

        const isMoving = left !== 0 || right !== 0 || up !== 0 || down !== 0;

        if (isMoving) {
            if (down) this.playAnimation('walkDown');
            else if (up) this.playAnimation('walkUp');
            else if (right) this.playAnimation('walkRight');
            else if (left) this.playAnimation('walkLeft');
        } else {
            // If not moving, switch to the idle animation corresponding to the last direction
            if (this.currentAnimation.startsWith('walk')) {
                this.playAnimation(this.currentAnimation.replace('walk', 'idle'));
            }
        }

        super.update(ticker); // Call parent update for movement logic
        
        // Calculate desired position based on input
        let dirToMoveX = left + right;
        let dirToMoveY = up + down;
        // The movement speed should be a fixed value, not multiplied by size, unless size dictates speed.
        // For a human player, a consistent speed might be better.
        // Let's use a base speed. You can adjust this value.
        const playerMoveSpeed = 5; // Example speed, adjust as needed
        let dirToMove = { x: dirToMoveX * playerMoveSpeed, y: dirToMoveY * playerMoveSpeed };

        this.desiredPosition = GameUtils.sumVec2(this.position, dirToMove);
    }

    playAnimation(animationName) {
        if (this.currentAnimation === animationName) {
            return;
        }

        this.currentAnimation = animationName;
        this.sprite.textures = this.sheet.animations[animationName];
        this.sprite.play();
    }
}