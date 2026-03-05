export const GAME_CONFIG = {
    // Configuracion de armas
    WEAPONS: {
        BOW: {
            name: "Arco",
            damage: 25,
            cooldown: 300,
            projectileCount: 1,
            spreadAngle: 0,
            color: 0x00ff00,
        },
        WAND: {
            name: "Vara Enredada",
            damage: 20,
            cooldown: 600,
            projectileCount: 3,
            spreadAngle: 20,
            color: 0xff8800,
        },
        STAFF: {
            name: "Baculo",
            damage: 15,
            cooldown: 80,
            projectileCount: 1,
            spreadAngle: 5,
            color: 0xff4444,
        },
        WHIP: {
            name: "Latigo de Fuego",
            damage: 22,
            cooldown: 400,
            projectileCount: 5,
            spreadAngle: 15,
            color: 0x44ff44,
        },
    },

    // Configuracion de powerups
    POWERUPS: {
        SPAWN_INTERVAL: 8000,
        MAX_ON_SCREEN: 4, // Limite de powerups en pantalla
        PICKUP_RADIUS: 25,
        SPAWN_DISTANCE_MIN: 150,
        SPAWN_DISTANCE_MAX: 400,

        // Efectos de powerups
        HEALTH_HEAL_AMOUNT: 25,
        SPEED_INCREASE: 0.3,
        MAX_PLAYER_HEALTH: 100,
        MAX_PLAYER_SPEED: 10,

        // Rareza
        WEIGHTS: {
            health: 4, // Common
            speed: 2, // Uncommon
            pistol: 3, // Common
            shotgun: 2, // Uncommon
            machinegun: 1, // Rare
            burst: 1, // Rare
        },
    },

    // Configuracion de enemigos
    ENEMIES: {
        SPAWN_DISTANCE_MIN: 10, // celdas
        SPAWN_DISTANCE_MAX: 20, // celdas

        // OLeadas
        GRUNT_BASE_COUNT: 300,
        GRUNT_WAVE_MULTIPLIER: 2,
        FAST_BASE_COUNT: 1,
        FAST_WAVE_MULTIPLIER: 1,

        // Escalado de enemigos
        HEALTH_SCALE_PER_WAVE: 1.1, // +10% de vida por oleada
        DAMAGE_SCALE_PER_WAVE: 1.05, // +5% de daño por oleada
        SPEED_SCALE_PER_WAVE: 1.02, // +2% de velocidad por oleada
    },

    // Configuracion del jugador
    PLAYER: {
        BASE_HEALTH: 100,
        BASE_SPEED: 5,
        INVINCIBILITY_TIME: 1500,

        // Feedback visual
        DAMAGE_TINT: 0xff0000, // Rojo
        INVINCIBLE_TINT: 0xaaaaaa, // Gris
    },

    // Configuracion pathfinding
    PATHFINDING: {
        GRID_SIZE: 32,
        UPDATE_INTERVAL: 500,
        REACHED_THRESHOLD: 20,
    },

    // Configuracion de obstaculos
    OBSTACLES: {
        TREE_COUNT: 15,
        ROCK_COUNT: 10,
        BUILDING_COUNT: 5,
        SCATTERED_COUNT: 20,
    },

    // Z-Index
    Z_INDEX: {
        BACKGROUND: 0,
        OBSTACLES: 100,
        ENEMIES: 200,
        PLAYER: 300,
        PROJECTILES: 400,
        UI: 1000,
    },

    // Progresion del juego
    WAVES: {
        COMPLETION_DELAY: 3000,
        VICTORY_WAVE: 15,

        // Eventos especiales por oleadas
        BOSS_WAVES: [5, 10, 15],
        POWERUP_WAVES: [3, 7, 12],
    },

    // Configuracion visual
    GRAPHICS: {
        GRID_COLOR: 0x333333,
        GRID_ALPHA: 0.3,
        HIT_EFFECT_DURATION: 200,
        HIT_EFFECT_COLOR: 0xff4444,

        // Configuracion de proyectiles
        PROJECTILE_RADIUS: 4,
        PROJECTILE_SPEED: 300,
        PROJECTILE_LIFETIME: 3000,
    },

    // Configuacion de audio
    AUDIO: {
        MUSIC_VOLUME: 0.1,
        SFX_VOLUME: 0.2,
        ENABLE_MUSIC: true,
        ENABLE_SFX: true,

        // Sonidos y musica
        SOUNDS: {
            MUSIC: "assets/fx/music.wav",
            ENEMY_DEATH: "assets/fx/enemy_death.wav",
            PROJECTILE: "assets/fx/projectile.wav",
            DAMAGED: "assets/fx/damaged.wav",
        },
    },

    // Debug
    DEBUG: {
        SHOW_GRID: true,
        SHOW_COLLISION_BOXES: false,
        LOG_SPAWNS: true,
        LOG_POWERUPS: true,
    },
};
