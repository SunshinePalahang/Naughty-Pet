import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./ui.js"

const audio = new Audio ('Audio/bgnd_mus.flac')

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d' );
    canvas.width = 1300;
    canvas.height = 680;

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 30;
            this.speed = 0;
            this.maxSpeed = 6;
            this.background = new Background(this);
            this.character = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.score = 0;
            this.time = 0;
            this.maxTime = 50000;
            this.gameOver = false;
            this.fontColor = 'white'
            this.character.currentState = this.character.states[0];
            this.character.currentState.enter();
        }
        update(deltaTime){
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.character.update(this.input.keys, deltaTime);
            //enemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });
            //particles
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.markedForDeletion) this.particles.splice(index, 1);
            });
            if (this.particles.length > this.maxParticles) {
                this.particles = this.particles.slice(0, this.maxParticles);
            }
            //collision
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if (collision.markedForDeletion) this.collisions.splice(index, 1);
            });

        }
        draw(context){
            this.background.draw(context);
            this.character.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.UI.draw(context)
        }
        addEnemy(){
            if (this.speed > 0 && Math.random()< 0.5) this.enemies.push(new GroundEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function showInstructions(){
        let modal = document.getElementById('instructionsModal');
        modal.style.display = 'block';
    }
    showInstructions()

    function startGame(){
        let modal = document.getElementById('instructionsModal');
        document.getElementById('start').addEventListener('click', function(){
            modal.style.display = 'none';
        });
    }
    startGame()

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate), audio.play();
        else if (game.gameOver) audio.pause();
    }
    animate(0)
});
