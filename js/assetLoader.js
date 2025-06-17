// No longer importing Assets from 'pixi.js'

export class AssetLoader {
  static async loadAssets() {
    // Use the global PIXI object
    PIXI.Assets.addBundle('game-assets', {
      playerSheet: 'assets/images/player2.json',
    });

    // Use the global PIXI object
    const assets = await PIXI.Assets.loadBundle('game-assets');
    return assets;
  }
}