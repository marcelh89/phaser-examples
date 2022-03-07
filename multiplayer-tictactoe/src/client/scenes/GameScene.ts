import Phaser from 'phaser';
import Server from "../services/Server";
import {Cell, GameState, ITicTacToeState} from "../../Types/ITicTacToeState";
import {IGameOverSceneData, IGameSceneData} from "../../Types/scenes";

export default class GameScene extends Phaser.Scene {

    private server?: Server
    private onGameOver?: (data: IGameOverSceneData) => void

    private gameStateText?: Phaser.GameObjects.Text

    private cells: { display: Phaser.GameObjects.Rectangle, value: Cell }[] = []

    constructor() {
        super('game');
    }

    init(){
        this.cells = []
    }

    async create(data: IGameSceneData) {

        const {server, onGameOver} = data;

        this.server = server;
        this.onGameOver = onGameOver;

        if (!this.server) {
            throw new Error('server instance missing')
        }

        await this.server.join();

        this.server.onceStateChanged(this.createBoard, this)

    }

    private createBoard(state: ITicTacToeState) {

        const {width, height} = this.scale;

        const SPACE = 5;
        const CELL = 128;

        let x = (width * 0.5) - CELL;
        let y = (height * 0.5) - CELL;

        state.board.forEach((cellState, idx) => {

            const cell = this.add.rectangle(x, y, CELL, CELL, 0xffffff)
                .setInteractive()
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                    this.server?.makeSelection(idx)
                })

            switch (cellState) {
                case Cell.X:
                    this.add.star(cell.x, cell.y, 4, 4, 60, 0xff0000)
                        .setAngle(45)
                    break;
                case Cell.O:
                    this.add.circle(cell.x, cell.y, 60, 0x0000ff)
                    break;
            }

            this.cells.push({
                display: cell,
                value: cellState
            })

            x += CELL + SPACE;

            if ((idx + 1) % 3 === 0) {
                y += CELL + SPACE
                x = (width * 0.5) - CELL;
            }
        })

        if (this.server?.gameState === GameState.WaitingForPlayers) {
            const width = this.scale.width
            this.gameStateText = this.add.text(width * 0.5, 50, 'Waiting for opponent...')
                .setOrigin(0.5)
        }

        this.server?.onBoardChanged(this.handleBoardChanged, this)
        this.server?.onPlayerTurnChange(this.handlePlayerTurnChanged, this)
        this.server?.onPlayerWon(this.handlePlayerWon, this)
        this.server?.onGameStateChanged(this.handleGameStateChanged, this)

    }

    private handleBoardChanged(newValue: Cell, idx: number) {

        const cell = this.cells[idx];
        if (cell.value !== newValue) {
            switch (newValue) {
                case Cell.X:
                    this.add.star(cell.display.x, cell.display.y, 4, 4, 60, 0xff0000)
                        .setAngle(45)
                    break;
                case Cell.O:
                    this.add.circle(cell.display.x, cell.display.y, 60, 0x0000ff)
                    break;
            }

            cell.value = newValue
        }
    }

    private handlePlayerTurnChanged(playerIndex: number) {
        console.log(playerIndex)
        // TODO show a message letting player know if it is their turn
    }

    private handlePlayerWon(playerIndex: number) {
        this.time.delayedCall(1000, () => {
            if (!this.onGameOver) return
            this.onGameOver({winner: this.server?.playerIndex === playerIndex})
        })
    }

    private handleGameStateChanged(state: GameState) {
        if (state === GameState.Playing && this.gameStateText) {
            this.gameStateText.destroy()
            this.gameStateText = undefined;
        }

    }
}