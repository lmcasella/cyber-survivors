// No longer importing Assets from 'pixi.js'

export class AssetLoader {
  static async loadAssets() {
    // Use the global PIXI object
    const assets = await PIXI.Assets.load('assets/images/player2.json');
    return assets;
  }
}