/**
 * A behaviour definition driven by a state machine controller.
 */
export default class State {

    constructor(){
        this.context = undefined;
    }

    /**
     * Runs once when the state is created or transitioned from a previous state.
     */
    onStateEnter(context) {
        this.context = context;
    }

    /**
     * Rons on every update call (per-frame basis)
     */
    onStateUpdate(context, ticker) {
        this.context = context;
    }

    /**
     * Runs on every render call (per-frame basis, separated from update for performance)
     */
    onStateRender(context) {
        this.context = context;
    }

    /**
     * Runs once when the state transitions to a new state.
     */
    onStateExit(context) {
        this.context = context;
    }
}