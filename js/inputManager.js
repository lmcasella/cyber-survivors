export class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            justClicked: false,
        };
    }

    init() {
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));

        // Add mouse event listeners
        window.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mouseup", (e) => this.onMouseUp(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    }

    onKeyDown(e) {
        this.keys[e.code] = true;
    }

    onKeyUp(e) {
        this.keys[e.code] = false;
    }

    onMouseDown(e) {
        this.mouse.isDown = true;
        this.mouse.justClicked = true;
        this.updateMousePosition(e);
    }

    onMouseUp(e) {
        this.mouse.isDown = false;
        this.updateMousePosition(e);
    }

    onMouseMove(e) {
        this.updateMousePosition(e);
    }

    updateMousePosition(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    isKeyDown(keyCode) {
        return !!this.keys[keyCode];
    }

    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }

    isMouseDown() {
        return this.mouse.isDown;
    }

    wasMouseJustClicked() {
        const clicked = this.mouse.justClicked;
        this.mouse.justClicked = false; // Reset after checking
        return clicked;
    }
}
