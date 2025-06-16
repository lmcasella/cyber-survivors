import { GameEntity } from "../game-entity.js";
import { Graphics } from "pixi.js";
import { GameUtils } from "../../core/utils.js";
import { CreatureSegment } from "./creatureSegment.js";

export class Creature extends GameEntity {
    constructor(gameManager) {
        super(gameManager);

        let randomPos = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight };

        this.segments = [this];

        this.isSelectable = true;
        this.size = 20 + Math.random() * 20; // default 40
        this.movementSpeed = 2 / this.size;
        this.desiredRotation = 0;
        this.desiredPosition = randomPos;
        this.sprite = new Graphics().circle(0, 0, this.size).fill(0xffffff);
        this.position = randomPos;
        this.drawDebugLines();
        this.createSegments();

        this.sprite.eventMode = "static";
        this.sprite.cursor = "pointer";
        this.sprite.on('pointerdown', () => this.addNewSegment());
    }

    drawDebugLines() {
        super.drawDebugLines();

        this.g = new Graphics();
        this.gameManager.world.addChild(this.g);
    }

    createSegments() {
        for(let i = 0; i < 10; i++){
            this.addNewSegment();
        }
    }

    addNewSegment(){
        let lastSegment = this.segments[this.segments.length - 1];
        let params = {
            next: lastSegment,
            id: this.segments.length,
            controller: this
        };
        let newSegment = new CreatureSegment(this.gameManager, params);
        this.segments.push(newSegment);
        this.gameManager.world.addChild(newSegment.sprite);

        this.adjustSegmentSizes();
    }

    adjustSegmentSizes(){
        for(let i = 1; i < this.segments.length; i++){
            let segment = this.segments[i];
            segment.adjustSize();
        }
    }

    /**
     * Defines the size based on a segment id, which considers the head size and overall segments count.
     * @param id
     * @returns {number}
     */
    segmentSize(id) {
        // return this.size - this.segments.length;
        // return (this.segments.length / id);
        // return this.size * (0.5 + Math.cos((id / this.segments.length * 4)));
        return this.size - this.size * (id / this.segments.length)
    }

    splitSegmentAtIndex(id){
        let segment = this.segments[id];
        segment.nextSegment = undefined;
        this.segments = this.segments.slice(0, id);
        this.adjustSegmentSizes();
    }

    start(){
    }

    update(ticker) {
        super.update(ticker);

        let hasReachedTarget = GameUtils.distanceToVec2(this.position, this.desiredPosition).magnitude > this.size;

        if(hasReachedTarget) {
            this.handleRotation();
            this.handleMovement();
        }

        // Debug line that displays where the creatures are trying to move towards
        this.g.position = this.position;
        this.g.clear();
        let drawPoint = GameUtils.diffVec2(this.desiredPosition, this.position);
        this.g.lineTo(drawPoint.x, drawPoint.y).stroke(0xff0000);
    }

    eat(predator){
        console.log("Someone tried to eat a head!");
    }

    handleRotation() {
        let angleDifference = GameUtils.degDiff(this.sprite.angle, this.desiredRotation);
        let dynamicMotion = (Math.sin((performance.now()) / (this.size * 8)) * 15);
        this.sprite.angle += GameUtils.lerp(0, GameUtils.clamp(angleDifference + dynamicMotion, -30, 30), 0.1);
    }

    handleMovement() {
        this.position = GameUtils.lerpVec2(this.position, this.forwardDirection(), this.movementSpeed);
    }

    connectionPoint() {
        let pos = this.position;
        let rot = this.sprite.rotation;

        let target = GameUtils.pointAroundCircle(rot, this.size, 180);
        return GameUtils.sumVec2(pos, target);
    }

    forwardDirection() {
        let pos = this.position;
        let rot = this.sprite.rotation;
        let target = GameUtils.pointAroundCircle(rot, this.size);
        return GameUtils.sumVec2(pos, target);
    }

    rightDirection(){
        let pos = this.position;
        let rot = this.sprite.rotation;
        // let r = 1;
        // let x = r * Math.cos(rot + GameUtils.deg2rad(90));
        // let y = r * Math.sin(rot + GameUtils.deg2rad(90));
        // return { x: x, y: y }

        let target = GameUtils.pointAroundCircle(rot, this.size, 90);
        return GameUtils.sumVec2(pos, target);
    }
}