class GameManager {
    constructor(){
        this.gravity = { x: 0, y: 0 };
        this.wind = { x: 0, y: 0 };
        this.gameEntities = [];
        this.app = new PIXI.Application();
        this.cursor = new Cursor(this);

        this.keysPressed = {};

        this.world = new PIXI.Container();
        this.app.stage.addChild(this.world);

        window.addEventListener("keydown", e => this.keysPressed[e.key] = true);
        window.addEventListener("keyup", e => this.keysPressed[e.key] = false);

        this.init();

        // this.setupApp().then(r => this.onAppInitialized());
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
        // We already have this.app from the constructor
        await this.setupApp(); 

        // Define the asset bundle
        PIXI.Assets.addBundle('game-assets', {
            'tile-dirt': 'assets/images/tile-dirt.jpg', // Path to new assets folder
            'playerSheet': 'assets/images/player2.json'  // Path to new assets folder
        });

        // Load the bundle
        this.loadedAssets = await PIXI.Assets.loadBundle('game-assets');

        // Create background and entities
        this.background = await this.createBackground(this.app, this.loadedAssets['tile-dirt']);
        this.onAppInitialized();
    }

    async createBackground(app, texture) {
        const background = new PIXI.TilingSprite({
            texture, // Use the passed texture
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
        // Pass the loaded spritesheet directly into the constructor
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