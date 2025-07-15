import { WeaponStrategy } from "./weaponStrategy.js";

export class BowWeapon extends WeaponStrategy {
    constructor() {
        super({
            name: "Bow",
            damage: 25,
            cooldown: 300,
            projectileCount: 1,
            spreadAngle: 0,
            color: 0xffff00,
        });
    }

    fire(player, targetPos) {
        // Simple single projectile toward target
        const projectile = this.createProjectile(
            player,
            player.position.x,
            player.position.y,
            targetPos.x,
            targetPos.y
        );

        player.game.addEntity(projectile);
        console.log(`🔫 Fired ${this.name}!`);
    }
}
