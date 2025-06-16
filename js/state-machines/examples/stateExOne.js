import {StateMachineController} from "../stateMachineController";
import State from "../state";
import {StateExTwo} from "./stateExTwo";

export class StateExOne extends State {
    constructor(context){
        super(context);
        this.listener = (e) => {this.keyPressed(e)};
    }

    onStateEnter(context) {
        super.onStateEnter(context);
        console.log("State Machine Example: State one!")

        window.addEventListener("keydown", this.listener);
    }

    keyPressed(e) {
        if(e.key === 'a') {
            this.context.stateMachine.setState(new StateExTwo());
        }
    }

    onStateExit(context) {
        super.onStateExit(context);
        window.removeEventListener("keydown", this.listener);
    }
}