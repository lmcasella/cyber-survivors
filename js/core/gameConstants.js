export const GAME_CONFIG = {
    // Weapon configurations
    WEAPONS: {
        PISTOL: {
            name: "Pistol",
            damage: 25,
            cooldown: 300,
            projectileCount: 1,
            spreadAngle: 0,
            color: 0xffff00,
        },
        SHOTGUN: {
            name: "Shotgun",
            damage: 20,
            cooldown: 600,
            projectileCount: 3,
            spreadAngle: 20,
            color: 0xff8800,
        },
        MACHINE_GUN: {
            name: "Machine Gun",
            damage: 15,
            cooldown: 80,
            projectileCount: 1,
            spreadAngle: 5,
            color: 0xff4444,
        },
        BURST: {
            name: "Burst Rifle",
            damage: 22,
            cooldown: 400,
            projectileCount: 5,
            spreadAngle: 15,
            color: 0x44ff44,
        },
    },

    // PowerUp configurations
    POWERUPS: {
        SPAWN_INTERVAL: 8000, // 8 seconds between spawns
        MAX_ON_SCREEN: 4, // Maximum powerups on screen
        PICKUP_RADIUS: 25, // How close player needs to be
        SPAWN_DISTANCE_MIN: 150, // Minimum spawn distance from player
        SPAWN_DISTANCE_MAX: 400, // Maximum spawn distance from player

        // PowerUp specific configs
        HEALTH_HEAL_AMOUNT: 25,
        SPEED_INCREASE: 0.5,
        MAX_PLAYER_HEALTH: 100,
        MAX_PLAYER_SPEED: 10,

        // Rarity weights
        WEIGHTS: {
            health: 4, // Common
            speed: 2, // Uncommon
            pistol: 3, // Common
            shotgun: 2, // Uncommon
            machinegun: 1, // Rare
            burst: 1, // Rare
        },
    },

    // Enemy configurations
    ENEMIES: {
        SPAWN_DISTANCE_MIN: 10, // cells
        SPAWN_DISTANCE_MAX: 20, // cells

        // Wave progression
        GRUNT_BASE_COUNT: 3,
        GRUNT_WAVE_MULTIPLIER: 2,
        FAST_BASE_COUNT: 1,
        FAST_WAVE_MULTIPLIER: 1,

        // Difficulty scaling
        HEALTH_SCALE_PER_WAVE: 1.1, // 10% more health per wave
        DAMAGE_SCALE_PER_WAVE: 1.05, // 5% more damage per wave
        SPEED_SCALE_PER_WAVE: 1.02, // 2% faster per wave
    },

    // Player configurations
    PLAYER: {
        BASE_HEALTH: 100,
        BASE_SPEED: 5,
        INVINCIBILITY_TIME: 1000, // 1 second after taking damage

        // Visual feedback
        DAMAGE_TINT: 0xff0000, // Red when damaged
        INVINCIBLE_TINT: 0xaaaaaa, // Gray when invincible
    },

    // Game progression
    WAVES: {
        COMPLETION_DELAY: 3000, // 3 seconds between waves
        VICTORY_WAVE: 20, // Game ends at wave 20

        // Special wave events
        BOSS_WAVES: [5, 10, 15, 20], // Waves with extra difficulty
        POWERUP_WAVES: [3, 7, 12], // Guaranteed powerup spawn
    },

    // Visual settings
    GRAPHICS: {
        GRID_COLOR: 0x333333,
        GRID_ALPHA: 0.3,
        HIT_EFFECT_DURATION: 200,
        HIT_EFFECT_COLOR: 0xff4444,

        // Projectile settings
        PROJECTILE_RADIUS: 4,
        PROJECTILE_SPEED: 300,
        PROJECTILE_LIFETIME: 3000,
    },

    // Debug settings
    DEBUG: {
        SHOW_GRID: true,
        SHOW_COLLISION_BOXES: false,
        LOG_SPAWNS: true,
        LOG_POWERUPS: true,
    },
};
