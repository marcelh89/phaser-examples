import {Schema, ArraySchema, type} from "@colyseus/schema";
import {Cell, GameState, ITicTacToeState} from "../../../Types/ITicTacToeState";

export class TicTacToeState extends Schema implements ITicTacToeState {

    @type('number')
    gameState = GameState.WaitingForPlayers

    @type(["number"])
    board: ArraySchema<number>

    @type('number')
    activePlayer = 0;

    @type('number')
    winningPlayer = -1

    constructor() {
        super();

        this.board = new ArraySchema(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }

}
