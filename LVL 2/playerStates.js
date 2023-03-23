import { Dust } from './particles.js';

const states = {
    SITTING: 0,
    RUNNING_LEFT: 1,
    RUNNING_RIGHT: 2,
    JUMPING: 3,
    FALLING: 4,
    HIT: 5,
}

class State{
    constructor(state, game){
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game) {
        super('SITTING', game);
    }
    enter(){
        this.game.character.frameX = 0;
        this.game.character.maxFrame = 2;
        this.game.character.frameY = 6;
    }
    handleInput(input){
        if (input.includes('d') || input.includes('a')) {
            this.game.character.setState(states.RUNNING_LEFT, 1);
            this.game.character.setState(states.RUNNING_RIGHT, 1);
        } else if (input.includes('w')) {
            this.game.character.setState(states.JUMPING, 1);
        }
    }
}

export class Running_Left extends State {
    constructor(game) {
        super('RUNNING_LEFT', game);
    }
    enter(){
        this.game.character.frameX = 0;
        this.game.character.maxFrame = 3;
        this.game.character.frameY = 1;
    }
    handleInput(input){
        this.game.particles.push(new Dust(this.game, this.game.character.x + this.game.character.width * 0.5, this.game.character.y + this.game.character.height));
        if (input.includes('s')) {
            this.game.character.setState(states.SITTING, 0);
        }
        else if (input.includes('a')) {
            this.game.character.setState(states.RUNNING_RIGHT, 1)
        } else if (input.includes('w')) {
            this.game.character.setState(states.JUMPING, 1);
        }
    }
}

export class Running_Right extends State {
    constructor(game) {
        super('RUNNING_Right', game);
    }
    enter(){
        this.game.character.frameX = 0;
        this.game.character.maxFrame = 3;
        this.game.character.frameY = 3;
    }
    handleInput(input){
        if (input.includes('s')) {
            this.game.character.setState(states.SITTING, 0);
        } else if (input.includes('d')) {
            this.game.character.setState(states.RUNNING_LEFT, 1)
        } else if (input.includes('w')) {
            this.game.character.setState(states.JUMPING, 1);
        }
    }
}

export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
    }
    enter(){
        this.game.character.maxFrame = 2;
        if (this.game.character.onGround()) this.game.character.vy -= 34;
        this.game.character.frameY = 8;
    }
    handleInput(input){
        if (this.game.character.vy > this.game.character.weight){
            this.game.character.setState(states.FALLING, 1)
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super('FALLING', game);
    }
    enter(){
        this.game.character.frameX = 0;
        this.game.character.maxFrame = 3;
        this.game.character.frameY = 1;
    }
    handleInput(input){
        if(this.game.character.onGround()){
            this.game.character.setState(states.RUNNING_LEFT, 1);
        }
    }
}

export class Hit extends State {
    constructor(game) {
        super('HIT', game);
    }
    enter(){
        this.game.character.frameX = 0;
        this.game.character.maxFrame = 1;
        this.game.character.frameY = 7;
    }
    handleInput(input){
        if (this.game.character.frameX >= 1 && this.game.character.onGround()){
            this.game.character.setState(states.HIT, -1 * 0.2)
        } else if (input.includes('d')) {
            this.game.character.setState(states.RUNNING_LEFT, 1)
        } else if (input.includes('a')) {
            this.game.character.setState(states.RUNNING_RIGHT, 1)
        }else if (input.includes('w')) {
            this.game.character.setState(states.JUMPING, 1);
        }else if (this.game.character.frameX >= 1 && !this.game.character.onGround()){
            this.game.character.setState(states.FALLING, 1);
        }
    }
}
