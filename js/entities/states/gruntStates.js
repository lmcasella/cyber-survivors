import { State } from "../../state-machine/state.js";

export class GruntWalkState extends State {
    updateEnemy(enemy, player, ticker) {
        // Grunt-specific walk behavior - slow and methodical
        if (enemy.isPlayerInAttackRange()) {
            enemy.stateMachine.setState(new GruntAttackState());
            return;
        }

        // Grunt moves in straight lines toward player
        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;

        // Simple directional animations
        if (Math.abs(dx) > Math.abs(dy)) {
            enemy.playAnimation(dx > 0 ? "walkRight" : "walkLeft");
        } else {
            enemy.playAnimation(dy > 0 ? "walkDown" : "walkUp");
        }
    }
}

export class GruntAttackState extends State {
    enter(enemy) {
        this.attackDuration = 1200; // Slow, heavy attack
        this.hasAttacked = false;
    }

    updateEnemy(enemy, player, ticker) {
        if (!enemy.isPlayerInAttackRange()) {
            enemy.stateMachine.setState(new GruntWalkState());
            return;
        }

        // // Heavy windup attack
        // if (!this.hasAttacked && this.attackDuration > 600) {
        //     // Show charging animation
        //     const dx = player.position.x - enemy.position.x;
        //     const dy = player.position.y - enemy.position.y;

        //     if (Math.abs(dx) > Math.abs(dy)) {
        //         enemy.playAnimation(dx > 0 ? "chargeRight" : "chargeLeft");
        //     } else {
        //         enemy.playAnimation(dy > 0 ? "chargeDown" : "chargeUp");
        //     }
        // }

        // Execute attack
        if (!this.hasAttacked && this.attackDuration <= 600) {
            enemy.attackPlayerInCell();
            this.hasAttacked = true;

            // Play attack animation
            const dx = player.position.x - enemy.position.x;
            const dy = player.position.y - enemy.position.y;

            if (Math.abs(dx) > Math.abs(dy)) {
                enemy.playAnimation(dx > 0 ? "attackRight" : "attackLeft");
            } else {
                enemy.playAnimation(dy > 0 ? "attackDown" : "attackUp");
            }
        }

        this.attackDuration -= ticker.deltaMS;

        if (this.attackDuration <= 0) {
            enemy.stateMachine.setState(new GruntWalkState());
        }
    }
}
