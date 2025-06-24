export class StateMachine {
    constructor(owner) {
        this.owner = owner; // The entity that owns this state machine (e.g., the Player)
        this.currentState = null;
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
}