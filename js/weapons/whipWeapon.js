import { WeaponStrategy } from "./weaponStrategy.js";

export class WhipWeapon extends WeaponStrategy {
    constructor() {
        super({
            name: "Whip",
            damage: 22,
            cooldown: 400,
            projectileCount: 5,
            spreadAngle: 15,
            color: 0x44ff44,
        });
    }

    fire(player, targetPos) {
        // Similar to your current shootShotgun but with different stats
        const dx = targetPos.x - player.position.x;
        const dy = targetPos.y - player.position.y;
        const baseAngle = Math.atan2(dy, dx);

        const angles = this.calculateSpreadAngles(
            baseAngle,
            this.projectileCount,
            this.spreadAngle
        );

        // Fire projectiles with slight delay for burst effect
        angles.forEach((angle, index) => {
            setTimeout(() => {
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
            }, index * 50); // 50ms delay between each bullet
        });

        console.log(`⚡ Fired ${this.name} burst!`);
    }
}
