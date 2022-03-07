import {Command} from '@colyseus/command'



export default class NextTurnCommand extends Command {

    // TODO can be written in single Line of Code
    execute(): void{
        /*const activePlayer = this.room.state.activePlayer;
        if(activePlayer === 0){
            this.room.state.activePlayer = 1;
        } else {
            this.room.state.activePlayer = 0;
        }*/

        this.room.state.activePlayer = Number(!this.room.state.activePlayer)

    }


}