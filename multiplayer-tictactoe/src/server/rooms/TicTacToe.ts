import {Client, Room} from 'colyseus'
import {Dispatcher} from "@colyseus/command";
import {TicTacToeState} from "./schema/TicTacToeState";
import {Message} from "../../Types/messages";
import PlayerSelectionCommand from "../../server/commands/PlayerSelectionCommand";
import {GameState} from "../../Types/ITicTacToeState";

export default class TicTacToe extends Room<TicTacToeState> {

    private dispatcher = new Dispatcher(this)

    onCreate() {
        this.maxClients = 2
        this.setState(new TicTacToeState())
        this.onMessage(Message.PlayerSelection, (client: Client, message) => {
            console.log(client.id, message);
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client,
                index: message.index
            })

        })
    }

    onJoin(client: Client): void {
        const idx = this.clients.findIndex(c => c.sessionId === client.sessionId)
        client.send(Message.PlayerIndex, {playerIndex: idx})

        if (this.clients.length >= 2) {
            this.state.gameState = GameState.Playing
            this.lock()
        }
    }

}