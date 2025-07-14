import { PowerUp } from "./powerUp.js";
import { PistolWeapon } from "../weapons/pistolWeapon.js";
import { ShotgunWeapon } from "../weapons/shotgunWeapon.js";
import { MachineGunWeapon } from "../weapons/machinegunWeapon.js";
import { BurstWeapon } from "../weapons/burstWeapon.js";

export class PistolPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "pistol", {
            name: "Pistol Upgrade",
            color: 0xffff00,
            radius: 8,
        });
    }

    onPickup(player) {
        player.switchWeapon(new PistolWeapon());
        console.log(`🎁 Player picked up ${this.name}!`);
    }
}

export class ShotgunPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "shotgun", {
            name: "Shotgun Upgrade",
            color: 0xff8800,
            radius: 10,
        });
    }

    onPickup(player) {
        player.switchWeapon(new ShotgunWeapon());
        console.log(`🎁 Player picked up ${this.name}!`);
    }
}

export class MachineGunPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "machinegun", {
            name: "Machine Gun Upgrade",
            color: 0xff4444,
            radius: 9,
        });
    }

    onPickup(player) {
        player.switchWeapon(new MachineGunWeapon());
        console.log(`🎁 Player picked up ${this.name}!`);
    }
}

export class BurstPowerUp extends PowerUp {
    constructor(gameManager) {
        super(gameManager, "burst", {
            name: "Burst Rifle Upgrade",
            color: 0x44ff44,
            radius: 9,
        });
    }

    onPickup(player) {
        player.switchWeapon(new BurstWeapon());
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
