import { BaseEnemy } from "./baseEnemy.js";
import { GruntWalkState } from "../states/gruntStates.js";
import { StateMachine } from "../../state-machine/stateMachine.js";

export class GruntEnemy extends BaseEnemy {
    constructor(gameManager, player, enemyAssets) {
        const gruntConfig = {
            speed: 3.5, // Slow and steady
            health: 40, // Tanky
            damage: 30, // High damage
            attackCooldown: 1500, // Slow attacks
            attackRange: 60, // Longer reach

            // Grunt boids behavior - formation fighters
            separationWeight: 10, // Less separation - they cluster
            alignmentWeight: 0.1, // More alignment - move in formation
            cohesionWeight: 0.2, // More cohesion - stick together
            playerAttackWeight: 1.2, // Methodical approach
        };

        // Call the constructor of the BaseEnemy class
        super(gameManager, player, enemyAssets, gruntConfig);
    }

    createSprite() {
        // Use grunt-specific sprite
        this.sprite = new PIXI.AnimatedSprite(
            this.enemyAssets.demon.animations.walkDown
        );
        this.sprite.currentAnimation = "walkDown";
        this.sprite.animationSpeed = 0.2; // Slower animation
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(1.3); // Bigger sprite
        // this.sprite.tint = 0x8b0000;
        this.sprite.play();

        this.sprite.position.copyFrom(this.position);
    }

    createStateMachine() {
        this.stateMachine = new StateMachine(this, this.player);
        this.stateMachine.setState(new GruntWalkState());
    }

    playAnimation(animationName) {
        // Grunt-specific animation mapping
        const gruntAnimations = {
            walkUp: "walkUp",
            walkDown: "walkDown",
            walkLeft: "walkLeft",
            walkRight: "walkRight",
            // "chargeUp": "attackUp",    // Use attack animations for charging
            // "chargeDown": "attackDown",
            // "chargeLeft": "attackLeft",
            // "chargeRight": "attackRight",
            attackUp: "attackUp",
            attackDown: "attackDown",
            attackLeft: "attackLeft",
            attackRight: "attackRight",
        };

        const mappedAnimation = gruntAnimations[animationName] || animationName;

        if (this.sprite.currentAnimation === mappedAnimation) return;

        try {
            if (this.enemyAssets.demon.animations[mappedAnimation]) {
                this.sprite.textures =
                    this.enemyAssets.demon.animations[mappedAnimation];
                this.sprite.currentAnimation = mappedAnimation;
                this.sprite.play();
            }
        } catch (error) {
            console.warn(`Grunt animation ${mappedAnimation} not found`);
        }
    }

    attackPlayerInCell() {
        const attacked = super.attackPlayerInCell(); // Call base method

        if (attacked) {
            console.log(
                `💪 GRUNT SMASH! Heavy attack for ${this.damage} damage!`
            );

            // Grunt-specific effects
            this.createSmashEffect();
        }

        return attacked;
    }

    createSmashEffect() {
        // Visual effect for grunt attack
        const effect = new PIXI.Graphics();
        effect.circle(0, 0, 20);
        effect.fill(0xff0000);
        effect.position.set(this.position.x, this.position.y);
        effect.alpha = 0.7;

        this.game.world.addChild(effect);

        // Animate effect
        setTimeout(() => {
            if (effect.parent) {
                this.game.world.removeChild(effect);
            }
        }, 500);
    }
}
