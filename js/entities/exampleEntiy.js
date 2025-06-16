import { Graphics } from "pixi.js";
import { GameEntity } from '../core/gameEntity.js';

/**
 * An example on how to use the GameEntity class.
 */
export class ExampleEntity extends GameEntity {
    constructor(app) {
        super(app);

        this.sprite = new Graphics()
            .circle(0, 0, 50)
            .fill(0xff0000);

        app.canvas.addEventListener('pointermove', (event) => {
            this.sprite.position.x = event.x;
        })

        this.sprite.position.x = window.innerWidth / 2;
        this.sprite.position.y = window.innerHeight / 2;
    }

    start(){
        super.start();
    }

    update(ticker) {
        let deltaTime = ticker.deltaTime;
        this.sprite.position.x += deltaTime;
    }
}