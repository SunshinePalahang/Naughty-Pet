export class InputHandler {
    constructor(){
        this.keys = [];
        window.addEventListener('keydown', e => {
            if ((   e.key === 's' ||
                    e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 'd' ||
                    e.key === 'Enter'
                ) && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            }
            console.log(e.key)
        });
        window.addEventListener('keyup', e => {
            if (e.key === 's' || 
                e.key === 'w' ||
                e.key === 'a' ||
                e.key === 'd' ||
                e.key === 'Enter' ){
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
            console.log(e.key, this.keys)
        })
    }
}