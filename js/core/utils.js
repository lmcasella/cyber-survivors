/**
 * Utility JavaScript file written by Gann4Life in order to work with PIXIJS
 * which aims to solve general problems that are solved in most game engines
 * for later reusability - 04.02.2025.
 */
export class GameUtils {
    /**
     * Linearly interpolates `a` and `b` by `t`.
     *
     * The parameter `t` is clamped between 0 and 1.
     * @param {number} a Start value - If `t` is `0` returns `a`.
     * @param {number} b End value - If `t` is `1` returns `b`.
     * @param {number} t Interpolation value between `a` and `b` - If `t` is 0.5 returns the midpoint between `a` and `b`.
     */
    static lerp(a, b, t) {
        t = this.clamp(t, 0, 1);
        return a + (b - a) * t;
    }

    /**
     * Linearly interpolates `a` and `b` x and y values by `t`.
     *
     * The parameter `t` is clamped between 0 and 1.
     * @param a Start position.
     * @param b End position.
     * @param t Interpolation value between `a` and `b`.
     */
    static lerpVec2(a, b, t){
        return {
            x: this.lerp(a.x, b.x, t),
            y: this.lerp(a.y, b.y, t)
        }
    }

    /**
     * Restricts `value` to be within range of `min` and `max`.
     * @param {number} value The value that we're going to restrict between `min` and `max` range.
     * @param {number} min The minimum value to clamp to. If `value` passes this value, returns `min`;
     * @param {number} max The maximum value to clamp to. If `value` passes this value, returns `max`.
     */
    static clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    static clampVec2(vector, range){
        return {
            x: this.clamp(vector.x, -range, range),
            y: this.clamp(vector.y, -range, range)
        }
    }

    /**
     * Calculates the rotation in radians to match the direction towards point B from point A.
     * @param {number} ax Point A's X position.
     * @param {number} ay Point A's Y position.
     * @param {number} bx Point B's X position.
     * @param {number} by Point B's Y position.
     * @returns
     */
    static rotateTowards(ax, ay, bx, by) {
        let diffX = bx - ax;
        let diffY = by - ay;
        return Math.atan2(diffY, diffX);
    }

    /**
     *
     * @param a
     * @param b
     */
    static distanceTo(a, b) {
        return b - a;
    }

    static distanceToAbs(a, b){
        return Math.abs(this.distanceTo(a, b));
    }

    static distanceToVec2(a, b) {
        let x = this.distanceTo(a.x, b.x);
        let y = this.distanceTo(a.y, b.y);
        let magnitude = Math.sqrt(x * x + y * y);

        return {
            x: x,
            y: y,
            magnitude: magnitude,
            normalized: (magnitude === 0) ? { x: 0, y: 0 } : { x: x / magnitude, y: y / magnitude }
        }
    }

    static distanceToVec2Abs(a, b) {
        return {
            x: Math.abs(this.distanceToVec2(a, b).x),
            y: Math.abs(this.distanceToVec2(a, b).y),
            magnitude: Math.abs(this.distanceToVec2(a, b).magnitude),
            normalized: this.distanceToVec2(a, b).normalized
        }
    }


    // radians = degrees * (pi/180)
    /**
     * Converts a 360 angle into radians.
     * @param deg The value in degrees to convert.
     * @returns {number} The angle converted into radians.
     */
    static deg2rad(deg){
        return deg * (Math.PI / 180);
    }

    // degrees = radians * (180/pi)
    /**
     * Converts a radian value to degrees (0° - 360°).
     * @param rad The radian value to convert.
     * @returns {number} The angle converted from radians.
     */
    static rad2deg(rad){
        return rad * (180 / Math.PI);
    }

    static degDiff(sourceAngle, targetAngle) {
        let delta = targetAngle - sourceAngle;

        if(delta > 180) delta -= 360;
        else if(delta < -180) delta += 360;

        return delta;
    }


    /** TODO: Test this feature
     * Calculates the point of a circle's surface given its angle and radius.
     * @param radians The rotation value in radians.
     * @param radius The radius of the circle.
     * @param offsetDegrees The angle to offset this position in degrees (0-360).
     * @returns {{x: number, y: number}} Position of circle's surface.
     */
    static pointAroundCircle(radians, radius = 50, offsetDegrees = 0){
        let x = radius * Math.cos(radians + this.deg2rad(offsetDegrees));
        let y = radius * Math.sin(radians + this.deg2rad(offsetDegrees));
        return { x: x, y: y }
    }

    /**
     * Adds two vectors together.
     * @param a The first vector
     * @param b The second vector.
     * @returns {{x: *, y: *}} Vector `a` + Vector `b`
     */
    static sumVec2(a, b){
        return {
            x: a.x + b.x,
            y: a.y + b.y
        }
    }

    /**
     * Returns the difference between two vectors.
     * @param a The first vector
     * @param b The second vector.
     * @returns {{x: *, y: *}} Vector `a` - Vector `b`
     */
    static diffVec2(a, b){
        return {
            x: a.x - b.x,
            y: a.y - b.y
        }
    }

    static multiplyVec2(a, m){
        return {
            x: a.x * m,
            y: a.y * m
        }
    }
}