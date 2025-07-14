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

        // PIXI.Assets.addBundle("weapons", {
        //     sword: "assets/images/weapons/sword.png",
        //     bow: "assets/images/weapons/bow.png",
        //     staff: "assets/images/weapons/staff.png",
        // });

        // PIXI.Assets.addBundle("audio", {
        //     backgroundMusic: "assets/audio/background.mp3",
        //     shootSound: "assets/audio/shoot.wav",
        //     hitSound: "assets/audio/hit.wav",
        // });

        // Load all bundles in parallel
        const [playerAssets, enemyAssets] = await Promise.all([
            PIXI.Assets.loadBundle("player"),
            PIXI.Assets.loadBundle("enemies"),
            // PIXI.Assets.loadBundle("weapons"),
            // PIXI.Assets.loadBundle("audio"),
        ]);

        // Return organized assets
        return {
            player: playerAssets,
            enemies: enemyAssets,
            // weapons: weaponAssets,
            // audio: audioAssets,
        };
    }

    /**
     * Load additional assets during gameplay (for dynamic loading)
     */
    // static async loadLevelAssets(levelNumber) {
    //     const levelAssets = await PIXI.Assets.load(
    //         `assets/levels/level${levelNumber}/background.png`
    //     );
    //     return levelAssets;
    // }

    /**
     * Preload critical assets first, then load others in background
     */
    // static async loadCriticalAssets() {
    //     // Load only essential assets first for faster game start
    //     const criticalAssets = await PIXI.Assets.load([
    //         "assets/images/player/texture.json",
    //         "assets/images/ui/loading.png",
    //     ]);

    //     return criticalAssets;
    // }
}
