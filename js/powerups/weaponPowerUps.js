import { PowerUp } from "./powerUp.js";
import { BowWeapon } from "../weapons/bowWeapon.js";
import { WandWeapon } from "../weapons/wandWeapon.js";
import { StaffWeapon } from "../weapons/StaffWeapon.js";
import { WhipWeapon } from "../weapons/whipWeapon.js";

export class BowPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "bow", {
            name: "Bow Upgrade",
            color: 0xffff00,
            radius: 8,
            weaponTexture: gameManager.assets.weapons.bow,
        });
    }

    onPickup(player) {
        player.switchWeapon(new BowWeapon());
        console.log(`🎁 Player picked up ${this.name}!`);
    }
}

export class WandPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "wand", {
            name: "Wand Upgrade",
            color: 0xff8800,
            radius: 10,
            weaponTexture: gameManager.assets.weapons.wand,
        });
    }

    onPickup(player) {
        player.switchWeapon(new WandWeapon());
        console.log(`🎁 Player picked up ${this.name}!`);
    }
}

export class StaffPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "staff", {
            name: "Staff Upgrade",
            color: 0xff4444,
            radius: 9,
            weaponTexture: gameManager.assets.weapons.staff,
        });
    }

    onPickup(player) {
        player.switchWeapon(new StaffWeapon());
        console.log(`🎁 Player picked up ${this.name}!`);
    }
}

export class WhipPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "whip", {
            name: "Whip Upgrade",
            color: 0x44ff44,
            radius: 9,
            weaponTexture: gameManager.assets.weapons.whip,
        });
    }

    onPickup(player) {
        player.switchWeapon(new WhipWeapon());
        console.log(`🎁 Player picked up ${this.name}!`);
    }
}

export class HealthPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "health", {
            name: "Health Pack",
            color: 0x00ff00,
            radius: 7,
        });
    }

    onPickup(player) {
        const healAmount = 25;
        player.health = Math.min(player.health + healAmount, 100); // Max 100 health
        console.log(
            `💚 Player healed for ${healAmount}! Health: ${player.health}`
        );
    }
}

export class SpeedPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "speed", {
            name: "Speed Boost",
            color: 0x00ffff,
            radius: 6,
        });
    }

    onPickup(player) {
        player.speed += 1; // Permanent speed increase
        console.log(`⚡ Player speed increased! New speed: ${player.speed}`);
    }
}
