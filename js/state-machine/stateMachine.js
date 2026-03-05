export class StateMachine {
    constructor(owner, player = null) {
        this.owner = owner;
        this.currentState = null;
        this.player = player; // Opcional
    }

    setState(newState) {
        if (this.currentState) {
            this.currentState.exit(this.owner);
        }

        this.currentState = newState;

        if (this.currentState) {
            this.currentState.enter(this.owner);
        }
    }

    update(ticker) {
        if (this.currentState) {
            this.currentState.update(this.owner, ticker);
        }
    }

    updateEnemy(ticker, player = this.player) {
        if (this.currentState && player) {
            this.currentState.updateEnemy(this.owner, player, ticker);
        }
    }
}
