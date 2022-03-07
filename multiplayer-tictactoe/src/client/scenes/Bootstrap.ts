import Phaser from 'phaser'
import Server from "../services/Server";
import {IGameOverSceneData} from "../../Types/scenes";

export default class Bootstrap extends Phaser.Scene {

    private server!: Server

    constructor(props) {
        super(props);
        console.log("constructor");
    }

    init() {
        this.server = new Server();
    }

    create() {
        this.createNewGame()
    }

    private handleGameOver =
        (data: IGameOverSceneData) => {
            this.server.leave()
            this.scene.stop('game')
            this.scene.launch('game-over', {
                ...data,
                onRestart: this.handleRestart
            })
        }

    private handleRestart = () => {
        this.scene.stop('game-over')
        this.scene.start('game')
    }

    private createNewGame() {
        this.scene.launch('game', {
            server: this.server,
            onGameOver: this.handleGameOver
        })
    }


}
