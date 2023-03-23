import { Sitting, Running_Left, Running_Right, Jumping, Hit, Falling } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";

export class Player {
    constructor(game){
        this.game = game;
        this.width = 95;
        this.height = 96;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin - 2;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('character');
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.maxFrame = 3;
        this.fps = 10;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.states = [new Sitting(this.game), new Running_Left(this.game), new Running_Right(this.game), new Jumping(this.game), new Falling(this.game), new Hit(this.game)];
        this.sound = new Audio();
        this.sound.src = './Audio/jump_04.wav';
    }
    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input)
        //horizontal movement
        this.x += this.speed;
        if (input.includes('d')) this.speed = this.maxSpeed;
        else if (input.includes('a')) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //vertical movement
        this.y += this.vy; 
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        //sprite animation
        if(!this.onGround()) this.sound.play();
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }
    draw(context){ 
        context.fillStyle = "rgba(0, 0, 200, 0)";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                enemy.markedForDeletion = true; 
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[3]){
                    this.game.score++;
                } else if (this.currentState === this.states[1] || this.states[2]){
                    this.setState(5, 0);
                }
                else {
                    this.setState(5, 0);
                }
            } 
        });
    }
}