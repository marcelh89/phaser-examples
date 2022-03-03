import Phaser from "phaser";
import WebFontFile from "./WebFontFile";
import * as SceneKeys from "../consts/SceneKeys";
import * as AudioKeys from "../consts/AudioKeys";

export default class PreloadScene extends Phaser.Scene {

    preload() {
        const fonts = new WebFontFile(this.load, "Press Start 2P")
        this.load.addFile(fonts);

        this.load.audio(AudioKeys.PongBeep, 'ping_pong_8bit_beeep.wav')
        this.load.audio(AudioKeys.PongPlop, 'ping_pong_8bit_plop.wav')
    }

    create() {
        this.scene.start(SceneKeys.TitleScene)
    }

}