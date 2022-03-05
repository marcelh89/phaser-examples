import Phaser from 'phaser'
import * as Colyseus from 'colyseus.js'

export default class HelloWorldScene extends Phaser.Scene {

    private client: Colyseus.Client;

    constructor() {
        console.log("constructor");
        super('hello-world')
    }

    init() {
        console.log("init");
        this.client = new Colyseus.Client('ws://localhost:5001')
    }

    preload() {
        console.log("preload");
    }

    async create() {
        console.log("create", this.client)

        const room = await this.client.joinOrCreate("room");
        console.log("joined successfully", room);

        room.onMessage('keydown', (message) => {
            console.log(message)
        })

        this.input.keyboard.on('keydown', (evt) => {
            room.send('keydown', evt.code)
        })


    }
}
