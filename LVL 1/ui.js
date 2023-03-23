function displayLevels(){
    let levels = document.getElementById('navi');
    levels.style.display = 'block';
}

export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
    }

    draw(context){
        context.save();
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.shadowColor = 'black';
        context.shadowBlur = 1;
        context.font = this.fontSize + 'px' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        //score
        context.fillText('Score: ' + this.game.score, 20, 40);
        //timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 70);
        // game over message
        if (this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if (this.game.score < 10) {
            context.fillText('Kino needs more points...', this.game.width * 0.5, this.game.height * 0.5 - 20);
            context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
            context.fillText('Refresh the page to start again!', this.game.width * 0.5, this.game.height * 0.5 + 20);
        } else {
            context.fillText('Kino did it!', this.game.width * 0.5, this.game.height * 0.5 - 20);
            context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
            context.fillText('Using his determination, Kino is now able to go to the next level!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            displayLevels()
        }
        }
    }
}