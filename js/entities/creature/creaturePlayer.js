class CreaturePlayer extends Creature {
    constructor(gameManager, sheet) {
        super(gameManager);

        this.keysPressed = [];

        // Store the sheet and current animation name on the instance
        this.sheet = sheet;
        this.currentAnimation = 'idleDown';

        // Create the sprite using the sheet that was passed in
        this.sprite = new PIXI.AnimatedSprite(this.sheet.animations[this.currentAnimation]);
        
        this.sprite.animationSpeed = 0.15;
        this.sprite.play();
        this.sprite.anchor.set(0.5, 1);
        
        this.position = { x: 300, y: 300 };
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;

        // this.gameManager.world.addChild(this.sprite);

        // Movimiento del jugador con las teclas
        // window.addEventListener('keydown', (event) => this.onKeyDown(event));
        // window.addEventListener('keyup', (event) => this.onKeyUp(event));

        // window.addEventListener('pointerdown', (event) => console.log(event));
    }

    onKeyDown(event) {
        this.keysPressed[event.key] = true;
    }

    onKeyUp(event) {
        this.keysPressed[event.key] = false;
    }

    onKeyPressed(event) {
        let movementInput = 0; // Inputs del jugador
        let positionToMove = this.desiredPosition + movementInput;

        this.desiredPosition = positionToMove;
    }

    update(ticker) {
        const keys = this.gameManager.keysPressed;
        const left = keys["ArrowLeft"] ? -1 : 0;
        const right = keys["ArrowRight"] ? 1 : 0;
        const up = keys["ArrowUp"] ? -1 : 0;
        const down = keys["ArrowDown"] ? 1 : 0;

        const isMoving = left !== 0 || right !== 0 || up !== 0 || down !== 0;

        if (isMoving) {
            if (down) this.playAnimation('walkDown');
            else if (up) this.playAnimation('walkUp');
            else if (right) this.playAnimation('walkRight');
            else if (left) this.playAnimation('walkLeft');
        } else {
            // If not moving, switch to the idle animation
            if (this.currentAnimation.startsWith('walk')) {
                this.playAnimation(this.currentAnimation.replace('walk', 'idle'));
            }
        }

        super.update(ticker);
        
        let dirToMoveX = left + right;
        let dirToMoveY = up + down;
        let dirToMove = { x: dirToMoveX * this.size * 2, y: dirToMoveY * this.size * 2 };

        this.desiredPosition = GameUtils.sumVec2(this.position, dirToMove);
    }

    playAnimation(animationName) {
        if (this.currentAnimation === animationName) {
            return;
        }

        this.currentAnimation = animationName;
        this.sprite.textures = this.sheet.animations[animationName];
        this.sprite.play();
    }
}