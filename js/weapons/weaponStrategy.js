import { Projectile } from "../entities/projectile.js";

export class WeaponStrategy {
    constructor(config) {
        this.name = config.name;
        this.damage = config.damage;
        this.cooldown = config.cooldown;
        this.projectileCount = config.projectileCount || 1;
        this.spreadAngle = config.spreadAngle || 0;
        this.projectileSpeed = config.projectileSpeed || 300;
        this.color = config.color || 0xffff00;
    }

    /**
     * Abstract method - each weapon implements its own firing logic
     * @param {Player} player - The player firing the weapon
     * @param {Object} targetPos - World position to fire toward
     */
    fire(player, targetPos) {
        throw new Error("fire() method must be implemented by subclass");
    }

    /**
     * Helper method to create a single projectile
     */
    createProjectile(player, startX, startY, targetX, targetY) {
        player.game.audioManager.playProjectileSound();

        return new Projectile(
            player.game,
            startX,
            startY,
            targetX,
            targetY,
            this.damage
        );
    }

    /**
     * Helper method to calculate spread angles
     */
    calculateSpreadAngles(baseAngle, projectileCount, spreadAngle) {
        const angles = [];

        if (projectileCount === 1) {
            angles.push(baseAngle);
        } else {
            const angleStep =
                (spreadAngle * Math.PI) / 180 / (projectileCount - 1);

            for (let i = 0; i < projectileCount; i++) {
                const angleOffset = (i - (projectileCount - 1) / 2) * angleStep;
                angles.push(baseAngle + angleOffset);
            }
        }

        return angles;
    }
}
