import { Application, Container, TilingSprite, Assets, Graphics, AnimatedSprite } from 'pixi.js';
import { GameUtils } from './core/utils.js';
import { GameEntity } from './core/gameEntity.js'; // Added for Cursor if it extends GameEntity
// import { Cursor } from './cursor.js'; // Assuming Cursor is a module, if it's external, its class must be exported.
import { SmcExample } from './entities/smcExample.js';
import { CreaturePlayer } from './entities/creature/creaturePlayer.js';
import { CreatureBot } from './entities/creature/creatureBot.js';
import { Food } from './entities/food.js';

export class GameManager {
    constructor(){
        this.gravity = { x: 0, y: 0 };
        this.wind = { x: 0, y: 0 };
        this.gameEntities = [];
        this.app = new Application();
        this.cursor = new Cursor(this); // Assuming Cursor is now a class

        this.keysPressed = {};

        this.world = new Container();
        this.app.stage.addChild(this.world);

        window.addEventListener("keydown", e => this.keysPressed[e.key] = true);
        window.addEventListener("keyup", e => this.keysPressed[e.key] = false);

        this.init();
        let smth = new SmcExample(this);
    }

    handleCameraMovement() {
        let dx = 0;
        let dy = 0;

        if (this.keysPressed["ArrowUp"]) dy -= 1;
        if (this.keysPressed["ArrowDown"]) dy += 1;
        if (this.keysPressed["ArrowLeft"]) dx -= 1;
        if (this.keysPressed["ArrowRight"]) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        const speed = 10;
        this.world.x -= dx * speed;
        this.world.y -= dy * speed;
    }

    async init() {
        await this.setupApp(); 

        Assets.addBundle('game-assets', {
            'tile-dirt': 'assets/images/tile-dirt.jpg',
            'playerSheet': 'assets/images/player2.json'
        });

        this.loadedAssets = await Assets.loadBundle('game-assets');

        this.background = await this.createBackground(this.app, this.loadedAssets['tile-dirt']);
        this.onAppInitialized();
    }

    async createBackground(app, texture) {
        const background = new TilingSprite({
            texture,
            width: app.screen.width * 4,
            height: app.screen.height * 4,
        });

        this.world.addChild(background);
    }

    async setupApp() {
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight
        });
        this.app.canvas.style.position = "absolute";
        document.body.appendChild(this.app.canvas);
    }

    onAppInitialized() {
        this.setupAllEntities();
        this.app.ticker.add(() => {
            this.handleCameraMovement();
            this.gameLoop();
        });
    }

    gameLoop(){
        for(let i = 0; i < this.gameEntities.length; i++) {
            this.gameEntities[i].update(this.app.ticker);
        }
        for(let i = 0; i < this.gameEntities.length; i++){
            this.gameEntities[i].render();
        }
    }

    setupAllEntities(){
        this.createPlayer();
        this.createBots();
        this.createFood();
        this.addEntitiesToStage();
    }

    createPlayer(){
        const player = new CreaturePlayer(this, this.loadedAssets.playerSheet);
        player.segments.forEach(i => {
            this.gameEntities.push(i);
        });
    }

    createBots(){
        for(let i = 0; i < 4; i++){
            let bot = new CreatureBot(this);
            bot.segments.forEach(i => {
                this.gameEntities.push(i);
            });
        }
    }

    createFood(){
        for(let i = 0; i < 40; i++){
            let food = new Food(this);
            this.gameEntities.push(food);
        }
    }

    addEntitiesToStage(){
        for(let i = 0; i < this.gameEntities.length; i++){
            const entity = this.gameEntities[i];
            this.world.addChild(entity.sprite);
        }
    }
}