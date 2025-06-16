import State from "../state";

/**
 * An individual state that integrates basic keypress detection trough 'onKeyPressed' method, which should be overriden.
 * Keep in mind it uses a 'event' parameter.
 */
export class StateWithInput extends State {
    constructor(context){
        super(context);
        this.listener = (evt) => {this.onKeyPressed(evt)};
    }

    onStateEnter(context) {
        super.onStateEnter(context);
        window.addEventListener("keydown", this.listener);
    }

    onStateExit(context) {
        super.onStateExit(context);
        window.removeEventListener("keydown", this.listener);
    }

    /**
     * Fires when a key is pressed.
     * @param event - The event received when an input is received.
     */
    onKeyPressed(event) {
        // Override me!
    }
}