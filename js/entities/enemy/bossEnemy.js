import { BaseEnemy } from "./baseEnemy.js";
import { BossWalkState } from "../states/bossStates.js";
import { StateMachine } from "../../state-machine/stateMachine.js";

export class BossEnemy extends BaseEnemy {
    constructor(gameManager, player, enemyAssets) {
        // Define fast enemy configuration
        const fastConfig = {
            speed: 2, // Very fast
            health: 200, // Glass cannon
            damage: 50, // Lower damage
            attackCooldown: 600,
            attackRange: 80,

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
            this.enemyAssets.boss.animations.walkDown
        );
        this.sprite.currentAnimation = "walkDown";
        this.sprite.animationSpeed = 0.4; // Faster animation
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(2); // Bigger sprite
        // this.sprite.tint = 0x00ced1;
        this.sprite.play();

        this.sprite.position.copyFrom(this.position);
    }

    createStateMachine() {
        this.stateMachine = new StateMachine(this, this.player);
        this.stateMachine.setState(new BossWalkState());
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
            if (this.enemyAssets.boss.animations[mappedAnimation]) {
                this.sprite.textures =
                    this.enemyAssets.boss.animations[mappedAnimation];
                this.sprite.currentAnimation = mappedAnimation;
                this.sprite.play();
            }
        } catch (error) {
            console.warn(`Boss animation ${mappedAnimation} not found`);
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
                `⚡ Boss attack! Quick attack for ${this.damage} damage!`
            );
        }

        return attacked;
    }
}
