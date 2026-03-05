import { BaseEnemy } from "./baseEnemy.js";
import { FastWalkState } from "../states/fastStates.js";
import { StateMachine } from "../../state-machine/stateMachine.js";

export class FastEnemy extends BaseEnemy {
    constructor(gameManager, player, enemyAssets) {
        // Define fast enemy configuration
        const fastConfig = {
            speed: 5.5, // Very fast
            health: 15, // Glass cannon
            damage: 15, // Lower damage
            attackCooldown: 600, // Quick attacks
            attackRange: 40, // Shorter reach

            // Fast enemy boids - chaotic movement
            separationWeight: 12.0, // More separation - spread out
            alignmentWeight: 0.2, // Less alignment - more chaotic
            cohesionWeight: 0.1, // Less cohesion - individual movement
            playerAttackWeight: 1.8, // Very aggressive
        };

        super(gameManager, player, enemyAssets, fastConfig);
    }

    createSprite() {
        // Use fast enemy sprite
        this.sprite = new PIXI.AnimatedSprite(
            this.enemyAssets.skeleton.animations.walkDown
        );
        this.sprite.currentAnimation = "walkDown";
        this.sprite.animationSpeed = 0.4; // Faster animation
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(0.8); // Smaller sprite
        // this.sprite.tint = 0x00ced1;
        this.sprite.play();

        this.sprite.position.copyFrom(this.position);
    }

    createStateMachine() {
        this.stateMachine = new StateMachine(this, this.player);
        this.stateMachine.setState(new FastWalkState());
    }

    playAnimation(animationName) {
        // Fast enemy animation mapping
        const fastAnimations = {
            runUp: "walkUp",
            runDown: "walkDown",
            runLeft: "walkLeft",
            runRight: "walkRight",
            quickAttack: "attackDown", // Use a quick attack animation
        };

        const mappedAnimation = fastAnimations[animationName] || animationName;

        if (this.sprite.currentAnimation === mappedAnimation) return;

        try {
            if (this.enemyAssets.skeleton.animations[mappedAnimation]) {
                this.sprite.textures =
                    this.enemyAssets.skeleton.animations[mappedAnimation];
                this.sprite.currentAnimation = mappedAnimation;
                this.sprite.play();
            }
        } catch (error) {
            console.warn(`Fast enemy animation ${mappedAnimation} not found`);
        }
    }

    calculatePlayerAttackForce() {
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // Add randomness for erratic movement
            const randomX = (Math.random() - 0.5) * 0.4;
            const randomY = (Math.random() - 0.5) * 0.4;

            return {
                x: (dx / distance) * 0.9 + randomX,
                y: (dy / distance) * 0.9 + randomY,
            };
        }
        return { x: 0, y: 0 };
    }

    attackPlayerInCell() {
        const attacked = super.attackPlayerInCell();

        if (attacked) {
            console.log(
                `⚡ FAST STRIKE! Quick attack for ${this.damage} damage!`
            );
        }

        return attacked;
    }
}
