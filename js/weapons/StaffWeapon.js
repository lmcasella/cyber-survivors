import { WeaponStrategy } from "./weaponStrategy.js";

export class StaffWeapon extends WeaponStrategy {
    constructor() {
        super({
            name: "Staff",
            damage: 15,
            cooldown: 80, // Very fast firing
            projectileCount: 1,
            spreadAngle: 5, // Slight inaccuracy
            color: 0xff4444,
        });
    }

    fire(player, targetPos) {
        // Add slight random spread for machine gun inaccuracy
        const dx = targetPos.x - player.position.x;
        const dy = targetPos.y - player.position.y;
        const baseAngle = Math.atan2(dy, dx);

        // Random spread for realism
        const spread =
            (Math.random() - 0.5) * ((this.spreadAngle * Math.PI) / 180);
        const angle = baseAngle + spread;

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
        console.log(`🔥 Fired ${this.name}!`);
    }
}
