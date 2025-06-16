import { GameEntity } from "../../core/gameEntity";
import { GameUtils } from "../../core/utils";
import { Graphics } from "pixi.js";

export class CreatureSegment extends GameEntity {
    constructor(gameManager, segmentParams) {
        super(gameManager);

        /*  Object properties:
        {
            next:
            id:
            controller:
        }
         */
        this.segmentParams = segmentParams;
        this.size = segmentParams.controller.segmentSize(segmentParams.id);
        this.sprite = new Graphics()
            .circle(0, 0, this.size)
            .fill(0xab34ba)
            .stroke(0xffaaea);
        this.drawDebugLines();
        this.nextSegment = this.segmentParams.next;
    }

    adjustSize(){
        let prevPos = this.position;
        let prevR = this.sprite.rotation;

        this.size = this.segmentParams.controller.segmentSize(this.segmentParams.id);

        this.gameManager.world.removeChild(this.sprite);

        this.sprite = new Graphics()
            .circle(0, 0, this.size)
            .fill(0xab34ba)
            .stroke(0xffaaea);
        this.position = prevPos;
        this.sprite.rotation = prevR;

        this.sprite.eventMode = "static";
        this.sprite.cursor = "pointer";
        this.sprite.on('pointerdown', () => {
            this.segmentParams.controller.splitSegmentAtIndex(this.segmentParams.id);
        });

        this.gameManager.world.addChild(this.sprite);
    }

    eat(predator) {
        console.log("eating");
        predator.addNewSegment();
        this.segmentParams.controller.splitSegmentAtIndex(this.segmentParams.id);
        this.gameManager.world.removeChild(this.sprite);
        let i = this.segmentParams.controller.world.indexOf(this);
        this.segmentParams.controller.world.slice(i);
    }

    start(){
        this.debugShape = new Graphics().circle(0, 0, 4).fill(0xffffff);
        this.gameManager.world.addChild(this.debugShape);
    }

    update(ticker){
        if(this.nextSegment === undefined) return;
        super.update(ticker);
        // let distX = this.nextSegment.position.x - this.position.x;
        // let distY = this.nextSegment.position.y - this.position.y;
        //
        // if(Math.abs(distX) > 50 || Math.abs(distY) > 50)
        // {
        //     this.position.x += distX / 4;
        //     this.position.y += distY / 4;
        // }

        this.debugUpdate();

        let targetPosition = this.nextSegment.connectionPoint();
        let distanceToNextSegment = GameUtils.distanceToVec2Abs(this.position, targetPosition).magnitude;
        if(distanceToNextSegment > this.size){
            this.position = GameUtils.lerpVec2(this.position, targetPosition, (distanceToNextSegment - this.size) / distanceToNextSegment);
        }

        this.sprite.rotation = GameUtils.rotateTowards(this.position.x, this.position.y, targetPosition.x, targetPosition.y);
    }

    connectionPoint() {
        let pos = this.position;
        let rot = this.sprite.rotation;
        let target = GameUtils.pointAroundCircle(rot, this.size, 180);
        return GameUtils.sumVec2(pos, target);
    }

    debugUpdate(){
        // this.debugShape.position =
    }
}