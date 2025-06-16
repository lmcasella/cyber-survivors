import State from "./state";

/**
 * A basic state machine controller, handles changing from various states and runs behaviours independently from each other.
 */
export class StateMachineController {
    constructor(context) {
        this.context = context;
    }

    /**
     * Sets a new state to be ran by the state machine controller, runs transitional methods as well.
     * @param nextState
     */
    setState(nextState){
        if(this.currentState !== undefined) this.currentState.onStateExit(this.context);
        this.currentState = nextState;
        this.currentState.onStateEnter(this.context);
    }

    /**
     * Runs the current state machine's update function.
     * @param ticker
     */
    update(ticker){
        if(this.currentState !== undefined)
            this.currentState.onStateUpdate(this.context, ticker);
    }

    /**
     * Runs the current state machine's render function.
     */
    render(){
        if(this.currentState !== undefined)
            this.currentState.onStateRender(this.context);
    }
}