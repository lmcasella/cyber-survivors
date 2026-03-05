import { State } from "../../state-machine/state.js";

export class BossWalkState extends State {
    updateEnemy(enemy, player, ticker) {
        // Fast enemy - quick, erratic movement
        if (enemy.isPlayerInAttackRange()) {
            enemy.stateMachine.setState(new BossAttackState());
            return;
        }

        // Add some randomness to movement
        const randomX = (Math.random() - 0.5) * 0.5;
        const randomY = (Math.random() - 0.5) * 0.5;

        const dx = player.position.x - enemy.position.x + randomX;
        const dy = player.position.y - enemy.position.y + randomY;

        // Fast animation changes
        if (Math.abs(dx) > Math.abs(dy)) {
            enemy.playAnimation(dx > 0 ? "walkRight" : "walkLeft");
        } else {
            enemy.playAnimation(dy > 0 ? "walkDown" : "walkUp");
        }
    }
}

export class BossAttackState extends State {
    enter(enemy) {
        this.attackDuration = 400; // Quick attack
        this.attackCount = 0;
        this.maxAttacks = 2; // Multi-hit attack
    }

    updateEnemy(enemy, player, ticker) {
        if (!enemy.isPlayerInAttackRange()) {
            enemy.stateMachine.setState(new BossWalkState());
            return;
        }

        // Quick successive attacks
        if (
            this.attackDuration % 200 === 0 &&
            this.attackCount < this.maxAttacks
        ) {
            enemy.attackPlayerInCell();
            this.attackCount++;

            // Quick attack animation
            enemy.playAnimation("quickAttack");
        }

        this.attackDuration -= ticker.deltaMS;

        if (this.attackDuration <= 0) {
            enemy.stateMachine.setState(new BossWalkState());
        }
    }
}
