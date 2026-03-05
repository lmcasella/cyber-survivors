import { State } from "../../state-machine/state.js";

export class WalkState extends State {
    updateEnemy(enemy, player) {
        // Checkea si el enemigo está en rango de ataque
        if (enemy.distanceToPlayer <= enemy.attackRange) {
            enemy.stateMachine.setState(new AttackState());
            return;
        }

        // Calcula la distancia hacia jugador
        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;

        // Manejo de direccion de movimiento
        if (Math.abs(dx) > Math.abs(dy)) {
            // Movimiento horizontal
            if (dx > 0) {
                enemy.playAnimation("walkRight");
            } else {
                enemy.playAnimation("walkLeft");
            }
        } else {
            // Movimiento vertical
            if (dy > 0) {
                enemy.playAnimation("walkDown");
            } else {
                enemy.playAnimation("walkUp");
            }
        }
    }
}

export class AttackState extends State {
    enter(enemy) {
        if (enemy.sprite && enemy.sprite.tint !== undefined) {
            // enemy.sprite.tint = 0xff0000;
        }
    }

    exit(enemy) {
        if (enemy.sprite && enemy.sprite.tint !== undefined) {
        }
    }

    updateEnemy(enemy, player, ticker) {
        this.attackDuration = 800; // FIXME: Revisar si es necesario
        this.attackStarted = false;

        // Checkea si el enemigo está fuera de rango de ataque
        if (enemy.distanceToPlayer > enemy.attackRange) {
            enemy.stateMachine.setState(new WalkState());
            return;
        }

        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!this.attackStarted) {
            this.attackStarted = true;

            // Ejecuta la animacion dependiendo de la direccion
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
