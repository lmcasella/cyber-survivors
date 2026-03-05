// No longer importing Assets from 'pixi.js'

export class AssetLoader {
    static async loadAssets() {
        // Method 3: Professional asset bundle system

        // Add assets to bundles for organized loading
        PIXI.Assets.addBundle("player", {
            player: "assets/images/player/texture.json",
        });

        PIXI.Assets.addBundle("enemies", {
            demon: "assets/images/enemies/demon/texture.json",
            skeleton: "assets/images/enemies/skeleton/texture.json",
            boss: "assets/images/enemies/boss/texture.json",
            // zombie: "assets/images/enemies/zombie/texture.json",
            // goblin: "assets/images/enemies/goblin/texture.json",
        });

        PIXI.Assets.addBundle("weapons", {
            bow: "assets/images/weapons/arco.png",
            staff: "assets/images/weapons/baculo.png",
            wand: "assets/images/weapons/vara_enredada.png",
            whip: "assets/images/weapons/latigo_fuego.png",
        });

        PIXI.Assets.addBundle("audio", {
            music: "assets/fx/music.wav",
            enemy_death: "assets/fx/enemy_death.wav",
            projectile: "assets/fx/projectile.wav",
            damaged: "assets/fx/damaged.wav",
        });

        // Load all bundles in parallel
        const [playerAssets, enemyAssets, weaponAssets, audioAssets] =
            await Promise.all([
                PIXI.Assets.loadBundle("player"),
                PIXI.Assets.loadBundle("enemies"),
                PIXI.Assets.loadBundle("weapons"),
                PIXI.Assets.loadBundle("audio"),
            ]);

        // Return organized assets
        return {
            player: playerAssets,
            enemies: enemyAssets,
            weapons: weaponAssets,
            audio: audioAssets,
        };
    }
}
