// No longer importing Assets from 'pixi.js'

export class AssetLoader {
  static async loadAssets() {
    // Use the global PIXI object
    const assets = await PIXI.Assets.load('assets/images/player/texture.json');
    return assets;
  }
}