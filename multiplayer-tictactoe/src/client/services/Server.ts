import {Client, Room} from 'colyseus.js'
import Phaser from 'phaser'
import {GameState, ITicTacToeState} from "../../Types/ITicTacToeState";
import {Message} from "../../Types/messages";
import {Schema} from "@colyseus/schema";

export default class Server {

    private client: Client
    private events: Phaser.Events.EventEmitter

    private room?: Room<ITicTacToeState>
    private _playerIndex = -1

    constructor() {
        this.client = new Client('ws://localhost:5001')
        this.events = new Phaser.Events.EventEmitter()
    }


    async join() {
        this.room = await this.client.joinOrCreate<ITicTacToeState>('tic-tac-toe');

        this.room.onMessage(Message.PlayerIndex, (message: { playerIndex: number }) => {
            this._playerIndex = message.playerIndex;
        })

        this.room.onStateChange.once(state => {
            this.events.emit('once-state-changed', state)
        })

        this.room.state.onChange = (changes) => {

            console.log("onChange")

            changes.forEach(change => {
                console.log("onChange", change);
                const {field, value} = change;

                switch (field) {
                    // case 'board':
                    //     this.events.emit('board-changed', value)
                    //     break;
                    case 'activePlayer':
                        this.events.emit('player-turn-changed', value)
                        break;
                    case 'winningPlayer':
                        this.events.emit('player-win', value)
                        break;
                    case 'gameState':
                        this.events.emit('game-state-changed', value)
                        break;
                }
            })
        }

        // since version 0.14 we need to manually update the parent containers state
        this.room.state.board.onChange = (item, idx) => {
            this.events.emit('board-changed', item, idx)
        }

    }

    leave() {
        this.room?.leave()
        this.events.removeAllListeners()
    }

    makeSelection(index: number) {
        if (!this.room) return;
        if (this.room.state.gameState !== GameState.Playing) return;

        if (this.playerIndex !== this.room.state.activePlayer) {
            console.warn('not this player\'s turn')
        } else {
            this.room.send(Message.PlayerSelection, {index})
        }

    }

    onceStateChanged(cb: (state: ITicTacToeState) => void, context?: any) {
        console.log("Server-onceStateChanged")
        this.events.once('once-state-changed', cb, context)
    }

    onBoardChanged(cb: (cell: number, index: number) => void, context?: any) {
        console.log("Server-onboardchanged")
        this.events.on('board-changed', cb, context)
    }

    onPlayerTurnChange(cb: (playerIndex: number) => void, context?: any) {
        this.events.on('player-turn-changed', cb, context);
    }

    onPlayerWon(cb: (playerIndex: number) => void, context?: any) {
        this.events.on('player-win', cb, context)
    }

    onGameStateChanged(cb: (state: GameState) => void, context?) {
        this.events.on('game-state-changed', cb, context)
    }


    // getter
    get playerIndex() {
        return this._playerIndex;
    }

    get gameState() {
        if (!this.room) {
            return GameState.WaitingForPlayers
        }
        return this.room?.state.gameState;
    }

}