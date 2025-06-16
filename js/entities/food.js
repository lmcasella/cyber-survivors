import {GameEntity} from "../core/gameEntity";
import {Graphics} from "pixi.js";
import {PhysicsEntity} from "../core/physicsEntity";
import {GameUtils} from "../core/utils";
import {Creature} from "./creature/creature";

export class Food extends PhysicsEntity {
    constructor(gameManager){
        super(gameManager);

        this.sprite = new Graphics().circle(0, 0, 4).fill(0x8B4513);

        let randomPos = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight };
        this.position = randomPos;
    }

    update(ticker){
        super.update(ticker);

        // Get away from segments

        // Get closer to heads

        let creatures = this.gameManager.gameEntities.filter(e => e instanceof Creature);
        creatures.forEach(creature => {
            let distance = GameUtils.distanceToVec2(this.position, creature.position);
            if(distance.magnitude < creature.size * 4) {
                this.addForce(GameUtils.multiplyVec2(distance.normalized, ticker.deltaTime / 10));
            }
        });
        creatures.forEach(creature => {
            creature.segments.forEach(segment => {
                let distance = GameUtils.distanceToVec2(this.position, segment.position);
                if(distance.magnitude < segment.size * 1.1) {
                    this.addForce(GameUtils.multiplyVec2(distance.normalized, -ticker.deltaTime));
                }
            })
        });
    }
}