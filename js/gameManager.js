// No longer importing Application from 'pixi.js'
import { AssetLoader } from './assetLoader.js';
import { Player } from './entities/player.js';
import { Enemy } from './entities/enemy.js';
import { InputManager } from './inputManager.js';

export class GameManager {
  constructor() {
    // Use the global PIXI object
    this.app = new PIXI.Application();
    this.input = new InputManager();
    this.entities = [];

    this.world = new PIXI.Container();
  }

  async init() {
    // Use the global PIXI object
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1a1a1a,
    });
    document.body.appendChild(this.app.canvas);
    this.input.init();

    this.app.stage.addChild(this.world);

    const assets = await AssetLoader.loadAssets();

    const player = new Player(this, assets);
    this.player = player;
    this.addEntity(player);

    // for (let i = 0; i < 10; i++) {
    //     const enemy = new Enemy(this, player);
    //     this.addEntity(enemy);
    // }

    this.app.ticker.add((ticker) => this.update(ticker));
  }

  addEntity(entity) {
    this.entities.push(entity);
    this.world.addChild(entity.sprite);
  }

  update(ticker) {
    for (const entity of this.entities) {
      entity.update(ticker);
    }

    this.world.pivot.copyFrom(this.player.position);
    this.world.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
  }
}