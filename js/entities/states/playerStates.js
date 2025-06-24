import { State } from "../../state-machine/state.js";

export class IdleState extends State {
    enter(player) {
        if (player.sprite.currentAnimation.startsWith('walk')) {
            player.playAnimation(player.sprite.currentAnimation.replace('walk', 'idle'))
        }
    }

    update(player) {
        if (player.velocity.x !== 0 || player.velocity.y !== 0) {
            player.stateMachine.setState(new WalkState())
        }
    }
}

export class WalkState extends State {
    update(player) {
        // If the player stops moving, transition to the IdleState
        if (player.velocity.x === 0 && player.velocity.y === 0) {
            player.stateMachine.setState(new IdleState());
            return; // Stop here to avoid updating animation on the same frame
        }

        // Update the walking animation based on direction
        if (Math.abs(player.velocity.x) > Math.abs(player.velocity.y)) {
            if (player.velocity.x > 0) player.playAnimation('walkRight');
            else player.playAnimation('walkLeft');
        } else {
            if (player.velocity.y > 0) player.playAnimation('walkDown');
            else player.playAnimation('walkUp');
        }
    }
}