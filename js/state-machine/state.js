export class State {
    // Metodo llamado cuando se entra en el estado
    enter(owner) {
        console.log(`Entering state: ${this.constructor.name}`);
    }

    // Metodo llamado en cada frame del juego mientras se está en el estado
    update(owner, ticker) {}

    updateEnemy(enemy, player) {}

    // Metodo llamado cuando se sale del estado
    exit(owner) {
        console.log(`Exiting state: ${this.constructor.name}`);
    }
}
