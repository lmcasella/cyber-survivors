import { PistolWeapon } from "./pistolWeapon.js";
import { ShotgunWeapon } from "./shotgunWeapon.js";
import { MachineGunWeapon } from "./machinegunWeapon.js";
import { BurstWeapon } from "./burstWeapon.js";

export class WeaponManager {
    constructor() {
        this.availableWeapons = {
            pistol: PistolWeapon,
            shotgun: ShotgunWeapon,
            machinegun: MachineGunWeapon,
            burst: BurstWeapon,
        };
    }

    /**
     * Creates a weapon instance by name
     * @param {string} weaponName - Name of weapon to create
     * @returns {WeaponStrategy} New weapon instance
     */
    createWeapon(weaponName) {
        const WeaponClass = this.availableWeapons[weaponName];

        if (!WeaponClass) {
            console.warn(`Unknown weapon: ${weaponName}, defaulting to pistol`);
            return new PistolWeapon();
        }

        return new WeaponClass();
    }

    /**
     * Gets all available weapon names
     * @returns {string[]} Array of weapon names
     */
    getAvailableWeaponNames() {
        return Object.keys(this.availableWeapons);
    }

    /**
     * Gets weapon info without creating instance
     * @param {string} weaponName - Name of weapon
     * @returns {Object} Weapon configuration
     */
    getWeaponInfo(weaponName) {
        const weapon = this.createWeapon(weaponName);
        return {
            name: weapon.name,
            damage: weapon.damage,
            cooldown: weapon.cooldown,
            projectileCount: weapon.projectileCount,
            spreadAngle: weapon.spreadAngle,
        };
    }

    /**
     * Gets recommended weapon for specific wave
     * @param {number} wave - Current wave number
     * @returns {string} Recommended weapon name
     */
    getRecommendedWeapon(wave) {
        if (wave <= 2) return "pistol";
        if (wave <= 5) return "shotgun";
        if (wave <= 8) return "machinegun";
        return "burst";
    }
}
