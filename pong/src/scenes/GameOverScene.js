import Phaser from "phaser";
import * as SceneKeys from "../consts/SceneKeys";
import * as Fonts from "../consts/Fonts";

export default class GameOverScene extends Phaser.Scene {

    /**
     *
     * @param data {{leftScore: number, rightScore: number}}
     */
    create(data) {
        let titleText = 'Game Over';
        if (data.leftScore > data.rightScore) {
            titleText = 'You Win!'
        }

        this.add.text(400, 200, titleText, {
            fontFamily: Fonts.PressStart2P,
            fontSize: 38
        }).setOrigin(0.5)

        this.add.text(400, 300, 'Press space to Continue!', {
            fontFamily: Fonts.PressStart2P
        }).setOrigin(0.5)

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SceneKeys.TitleScene)
        })

    }

    update() {

    }

}