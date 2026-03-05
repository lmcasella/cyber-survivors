import { State } from "../../state-machine/state.js";

export class IdleState extends State {
    enter(player) {
        if (player.sprite.currentAnimation.startsWith("walk")) {
            player.playAnimation(
                player.sprite.currentAnimation.replace("walk", "idle")
            );
        }
    }

    update(player) {
        if (player.velocity.x !== 0 || player.velocity.y !== 0) {
            player.stateMachine.setState(new WalkState());
        }
    }
}

export class WalkState extends State {
    update(player) {
        // Si el jugador no se está moviendo, cambia al estado Idle
        if (player.velocity.x === 0 && player.velocity.y === 0) {
            player.stateMachine.setState(new IdleState());
            return;
        }

        // Determina la dirección del movimiento y actualiza la animación
        if (Math.abs(player.velocity.x) > Math.abs(player.velocity.y)) {
            if (player.velocity.x > 0) player.playAnimation("walkRight");
            else player.playAnimation("walkLeft");
        } else {
            if (player.velocity.y > 0) player.playAnimation("walkDown");
            else player.playAnimation("walkUp");
        }
    }
}
