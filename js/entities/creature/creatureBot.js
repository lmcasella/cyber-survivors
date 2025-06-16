import { Creature } from './creature.js';
import { GameUtils } from '../../core/gameUtils.js';

export class CreatureBot extends Creature {
    constructor(gameManager) {
        super(gameManager);
        this.setRandomDesiredPosition();
    }

    update(ticker) {
        super.update(ticker);
        let distanceToTarget = GameUtils.distanceToVec2Abs(this.position, this.desiredPosition);
        // let closestEntity = this.closestSegment();
        let targetReached = distanceToTarget.magnitude < this.size * 2;
        this.desiredRotation = GameUtils.rad2deg(GameUtils.rotateTowards(this.position.x, this.position.y, this.desiredPosition.x, this.desiredPosition.y));

        // Keep distance from target
        if(targetReached)
        {
            this.setRandomDesiredPosition();
        }
        // if(distanceToTarget < this.size * 4 && closestEntity.size > this.size){
        //     this.desiredPosition = {
        //         x: closestEntity.connectionPoint().x * 8,
        //         y: closestEntity.connectionPoint().y * 8
        //     }
        // }
        // if(distanceToTarget.magnitude < this.size){
        //     closestEntity.eat(this);
        // }
    }

    setRandomDesiredPosition() {
        this.desiredPosition = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        }
    }

    closest(entities){
        let result;
        let distanceToResult;
        for(let i = 0; i < entities.length; i++){
            let entity = entities[i];
            let distanceToEntity = GameUtils.distanceToVec2Abs(this.position, entity.sprite.position).magnitude;
            let entityIsMine = this.segments.some(segment => segment === entity);
            if(!entityIsMine && (distanceToEntity < distanceToResult || distanceToResult === undefined))
            {
                result = entity;
                distanceToResult = distanceToEntity;
            }
        }
        return result;
    }

    smallest(entities) {
        let result = [];

        for(let i = 0; i < entities.length; i++){
            let entity = entities[i];
            let entityIsMine = this.segments.some(segment => segment === entity);
            if(!entityIsMine && entity.size < this.size )
                result.push(entity);
        }
        return result.sort((a, b) => { return  b - a});
    }

    closestEntity(range = 500){
        return this.closest(this.getWithinRange(this.world, range));
    }

    smallestEntity() {
        return this.smallest(this.world);
    }

    closestSegment(range = 500){
        try {

            let segments = this.closestEntity().segments;
            if(segments){
                return this.closest(segments, range);
            }
        } catch(e){
            console.error(e);
        }
    }

    closestEatableSegment() {
        return this.closest(this.smallest(this.closest(this.world).segments));
    }

    /**
     * Checks if an individual entity is within range.
     * @param entity
     * @param range
     * @returns {{x: *|number, y: *|number, magnitude: *|number}}
     */
    isWithinRange(entity, range) {
        return GameUtils.distanceToVec2Abs(this.position, entity.sprite.position).magnitude < range;
    }

    /**
     * From the given entities, filters the ones that are within the designed area.
     * @param entities
     * @param range
     * @returns {*}
     */
    getWithinRange(entities, range) {
        return entities.filter(e => this.isWithinRange(e, range))
    }

    /**
     * [] Find within range
     * [] Find closest within range
     * [] ??
     * [] ??
     */

    // TODO: World sensor class?

}