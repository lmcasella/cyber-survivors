import State from "../state";
import {StateExOne} from "./stateExOne";

export class StateExTwo extends State {
    constructor(context){
        super(context);
        this.listener = (e) => {this.keyPressed(e)};
    }

    onStateEnter(context) {
        super.onStateEnter(context);
        console.log("State Machine Example: State two! Press 'D' to exit this state.");

        window.addEventListener("keydown", this.listener);
    }

    keyPressed(e) {
        if(e.key === 'd') {
            this.context.stateMachine.setState(new StateExOne());
        }
    }

    onStateExit(context) {
        super.onStateExit(context);
        window.removeEventListener("keydown", this.listener);
    }
}