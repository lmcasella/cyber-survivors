class SmcExample extends GameEntity {
    constructor(gameManager){
        super(gameManager);
        this.stateMachine = new StateMachineController(this);
        this.newState = new StateExOne();
        this.stateMachine.setState(this.newState);
    }

    update(ticker){
        super.update(ticker);
        this.stateMachine.update(ticker);
    }

    render(){
        super.render();
        this.stateMachine.render();
    }
}