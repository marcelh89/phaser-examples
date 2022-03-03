import Phaser from 'phaser'
import * as SceneKeys from "../consts/SceneKeys";
import * as Fonts from "../consts/Fonts";
import * as AudioKeys from "../consts/AudioKeys";

export default class TitleScene extends Phaser.Scene {

    create() {
        const title = this.add.text(400, 250, "Pong", {
            fontSize: 50,
            fontFamily: Fonts.PressStart2P
        })

        title.setOrigin(0.5, 0.5);

        this.add.text(400, 300, 'Press Space to start', {
            fontFamily: Fonts.PressStart2P
        })
            .setOrigin(0.5, 0.5)

        this.input.keyboard.once(`keydown-SPACE`, () => {
            this.sound.play(AudioKeys.PongBeep)
            this.scene.start(SceneKeys.GameScene);
        })


    }
}