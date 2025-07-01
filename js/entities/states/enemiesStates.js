import { State } from "../../state-machine/state.js";

export class IdleState extends State {
    enter(enemy) {
        if (enemy.sprite.currentAnimation.startsWith("walk")) {
            enemy.playAnimation(
                enemy.sprite.currentAnimation.replace("walk", "idle")
            );
        }
    }

    update(enemy) {
        if (enemy.velocity.x !== 0 || enemy.velocity.y !== 0) {
            enemy.stateMachine.setState(new WalkState());
        }
    }
}

export class WalkState extends State {
    updateEnemy(enemy, player) {
        // If the enemy stops moving, transition to the IdleState
        // if (enemy.velocity.x === 0 && enemy.velocity.y === 0) {
        //     enemy.stateMachine.setState(new IdleState());
        //     return; // Stop here to avoid updating animation on the same frame
        // }

        // Update the walking animation based on direction
        // if (Math.abs(enemy.velocity.x) > Math.abs(enemy.velocity.y)) {
        //     if (enemy.velocity.x > 0) enemy.playAnimation("walkRight");
        //     else enemy.playAnimation("walkLeft");
        // } else {
        //     if (enemy.velocity.y > 0) enemy.playAnimation("walkDown");
        //     else enemy.playAnimation("walkUp");
        // }

        // if (enemy.position.x > player.position.x) {
        //     enemy.playAnimation("walkLeft");
        // }
        // if (enemy.position.x < player.position.x) {
        //     enemy.playAnimation("walkRight");
        // }
        // if (enemy.position.y > player.position.y) {
        //     enemy.playAnimation("walkUp");
        // }
        // if (enemy.position.y < player.position.y) {
        //     enemy.playAnimation("walkDown");
        // }

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
