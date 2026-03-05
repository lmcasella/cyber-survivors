import { WeaponStrategy } from "./weaponStrategy.js";

export class WandWeapon extends WeaponStrategy {
    constructor() {
        super({
            name: "Wand",
            damage: 20,
            cooldown: 600,
            projectileCount: 3,
            spreadAngle: 20,
            color: 0xff8800,
        });
    }

    fire(player, targetPos) {
        // Calculate base angle toward target
        const dx = targetPos.x - player.position.x;
        const dy = targetPos.y - player.position.y;
        const baseAngle = Math.atan2(dy, dx);

        // Get spread angles
        const angles = this.calculateSpreadAngles(
            baseAngle,
            this.projectileCount,
            this.spreadAngle
        );

        // Fire each projectile
        angles.forEach((angle) => {
            const distance = 500;
            const targetX = player.position.x + Math.cos(angle) * distance;
            const targetY = player.position.y + Math.sin(angle) * distance;

            const projectile = this.createProjectile(
                player,
                player.position.x,
                player.position.y,
                targetX,
                targetY
            );

            player.game.addEntity(projectile);
        });

        console.log(`💥 Fired ${this.name} with ${this.projectileCount}!`);
    }
}
