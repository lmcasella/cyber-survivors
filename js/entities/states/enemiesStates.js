import { State } from "../../state-machine/state.js";

export class WalkState extends State {
    updateEnemy(enemy, player) {
        if (enemy.distanceToPlayer <= enemy.attackRange) {
            enemy.stateMachine.setState(new AttackState());
            return;
        }

        // Calculate the direction from enemy to player
        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;

        // Determine which direction is stronger (horizontal vs vertical movement)
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal movement is stronger
            if (dx > 0) {
                enemy.playAnimation("walkRight"); // Player is to the right
            } else {
                enemy.playAnimation("walkLeft"); // Player is to the left
            }
        } else {
            // Vertical movement is stronger
            if (dy > 0) {
                enemy.playAnimation("walkDown"); // Player is below
            } else {
                enemy.playAnimation("walkUp"); // Player is above
            }
        }
    }
}

export class AttackState extends State {
    enter(enemy) {
        if (enemy.sprite && enemy.sprite.tint !== undefined) {
            enemy.sprite.tint = 0xff0000; // Red tint for attack
        }
    }

    exit(enemy) {
        if (enemy.sprite && enemy.sprite.tint !== undefined) {
            enemy.sprite.tint = 0x00ced1; // Reset to normal color
        }
    }

    updateEnemy(enemy, player, ticker) {
        // Check if player moved out of attack range
        this.attackDuration = 800; // 800ms attack duration
        this.attackStarted = false;

        if (enemy.distanceToPlayer > enemy.attackRange) {
            enemy.stateMachine.setState(new WalkState());
            return;
        }

        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!this.attackStarted) {
            this.attackStarted = true;

            // Play appropriate attack animation
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                    enemy.playAnimation("attackRight");
                } else {
                    enemy.playAnimation("attackLeft");
                }
            } else {
                if (dy > 0) {
                    enemy.playAnimation("attackDown");
                } else {
                    enemy.playAnimation("attackUp");
                }
            }
        }

        enemy.attackPlayerInCell();

        // Count down attack duration
        this.attackDuration -= ticker.deltaMS;

        if (this.attackDuration <= 0) {
            enemy.stateMachine.setState(new WalkState());
        }
    }
}
