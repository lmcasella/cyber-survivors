class GameEntity {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.isSelectable = false;
        this.position = { x: 0, y: 0 };
        this.sprite = new Graphics().rect(0, 0, 50, 50).fill(0xffffff);
        this.start();
    }

    drawDebugLines(){
        this.sprite = this.sprite
            .lineTo(50, 0).lineTo(0, 0).stroke(0xff0000)
            .lineTo(0, 50).stroke(0x00ff00);
    }

    start() {

    }

    update(ticker) {

    }

    render() {
        this.sprite.position = this.position;
        // this.sprite.position.x = this.position.x % this.app.canvas.width;
        // this.sprite.position.y = this.position.y % this.app.canvas.height;
    }

    setSelected(isSelected) {
        this.sprite.tint = isSelected ? 0x00ff00 : 0xffffff;
    }
}