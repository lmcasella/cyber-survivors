import {
    PistolPowerUp,
    ShotgunPowerUp,
    MachineGunPowerUp,
    BurstPowerUp,
} from "./weaponPowerUps.js";

export class PowerUpFactory {
    static powerUpTypes = [
        { type: "pistol", class: PistolPowerUp, weight: 3 },
        { type: "shotgun", class: ShotgunPowerUp, weight: 2 },
        { type: "machinegun", class: MachineGunPowerUp, weight: 2 },
        { type: "burst", class: BurstPowerUp, weight: 1 }, // Rarer
    ];

    /**
     * Creates a random powerup based on weighted probabilities
     * @param {GameManager} gameManager
     * @returns {PowerUp} A new powerup instance
     */
    static createRandomPowerUp(gameManager) {
        const randomType = this.getWeightedRandomType();
        return new randomType.class(gameManager);
    }

    /**
     * Creates a specific powerup type
     * @param {GameManager} gameManager
     * @param {string} type - The powerup type to create
     * @returns {PowerUp} A new powerup instance
     */
    static createPowerUp(gameManager, type) {
        const powerUpType = this.powerUpTypes.find((p) => p.type === type);

        if (!powerUpType) {
            throw new Error(`Unknown powerup type: ${type}`);
        }

        return new powerUpType.class(gameManager);
    }

    /**
     * Weighted random selection - rarer items have lower weight
     */
    static getWeightedRandomType() {
        const totalWeight = this.powerUpTypes.reduce(
            (sum, type) => sum + type.weight,
            0
        );
        let random = Math.random() * totalWeight;

        for (const type of this.powerUpTypes) {
            random -= type.weight;
            if (random <= 0) {
                return type;
            }
        }

        // Fallback to first type
        return this.powerUpTypes[0];
    }
}
