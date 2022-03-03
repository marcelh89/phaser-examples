import Phaser from "phaser";
import * as SceneKeys from "../consts/SceneKeys";
import * as Colors from "../consts/Colors";
import * as Fonts from "../consts/Fonts";
import * as AudioKeys from "../consts/AudioKeys";

const GameState = {
    Running : 'running',
    Playerwon: 'player-won',
    Aiwon: 'ai-won'
}

export default class GameScene extends Phaser.Scene {

    init() {
        this.gameState = GameState.Running;
        this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0)
        this.leftScore = 0;
        this.rightScore = 0;
    }

    create() {

        this.scene.run(SceneKeys.GameBackgroundScene)
        this.scene.sendToBack(SceneKeys.GameBackgroundScene)

        this.physics.world.setBounds(-100, 0, 1000, 500)

        this.ball = this.add.circle(400, 250, 10, Colors.white)
        this.physics.add.existing(this.ball);
        this.ball.body.setCircle(10)
        this.ball.body.setBounce(1, 1)
        this.ball.body.setMaxSpeed(400)

        this.ball.body.setCollideWorldBounds(true, 1, 1)
        this.ball.body.onWorldBounds = true;

        this.paddleLeft = this.add.rectangle(50, 250, 30, 100, Colors.white, 1);
        this.physics.add.existing(this.paddleLeft, true)

        this.paddleRight = this.add.rectangle(750, 250, 30, 100, Colors.white, 1);
        this.physics.add.existing(this.paddleRight, true)

        this.physics.add.collider(this.paddleLeft, this.ball, this.handlePaddleBallCollision, undefined, this);
        this.physics.add.collider(this.paddleRight, this.ball, this.handlePaddleBallCollision, undefined, this);

        this.physics.world.on('worldbounds', this.handleWorldBoundsCollision)

        this.leftScoreLabel = this.add.text(300, 125, '0', {
            fontSize: 48,
            fontFamily: Fonts.PressStart2P
        }).setOrigin(0.5, 0.5)

        this.rightScoreLabel = this.add.text(500, 125, '0', {
            fontSize: 48,
            fontFamily: Fonts.PressStart2P
        }).setOrigin(0.5, 0.5)

        this.cursors = this.input.keyboard.createCursorKeys();

        this.time.delayedCall(1500, () => {
            this.resetBall();
        })
    }

    update() {
        if(this.gameState != GameState.Running) return;
        this.processPlayerInput();
        this.updateAI();
        this.checkScore();
    }

    handleWorldBoundsCollision = (body, up, down, left, right) => {
        if (left || right ) return;
        this.sound.play(AudioKeys.PongPlop)
    }

    handlePaddleBallCollision(paddle, ball){
        this.sound.play(AudioKeys.PongBeep)

        /** @type {Phaser.Physics.Arcade.Body} */
        const body = this.ball.body;
        const vel = body.velocity;
        vel.x += 1.05;
        vel.y += 1.05;

        body.setVelocity(vel.x, vel.y);

    }

    processPlayerInput() {
        /** @type {Phaser.Physics.Arcade.StaticBody} **/
        const body = this.paddleLeft.body;

        if (this.cursors.up.isDown) {
            if (this.paddleLeft.y < 0) this.paddleLeft.y = 0;
            this.paddleLeft.y -= 10;
        } else if (this.cursors.down.isDown) {
            if (this.paddleLeft.y > 500) this.paddleLeft.y = 500;
            this.paddleLeft.y += 10;
        }
        body.updateFromGameObject();
    }


    updateAI() {
        const diff = this.ball.y - this.paddleRight.y;

        if (Math.abs(diff) < 10) return;

        const aiSpeed = 3;
        if (diff < 0) {
            // ball is above paddle
            this.paddleRightVelocity.y = -aiSpeed;
            if (this.paddleRightVelocity.y < -10) {
                this.paddleRightVelocity.y = -10
            }
        } else {
            // ball is below paddle
            this.paddleRightVelocity.y = 1;
            if (this.paddleRightVelocity.y > 10) {
                this.paddleRightVelocity.y = 10
            }
        }

        this.paddleRight.y += this.paddleRightVelocity.y;
        this.paddleRight.body.updateFromGameObject()

    }

    checkScore() {

        const x = this.ball.x;
        const leftBounds = -30;
        const rightBounds = 830;

        if(x >= leftBounds && x <= rightBounds){
            return;
        }


        if (this.ball.x < -30) {
            // scored on the left side
            this.incrementRightScore()
        } else if (this.ball.x > 830) {
            // scored on the right side
            this.incrementLeftScore()
        }

        const maxScore = 3;
        if(this.leftScore >= maxScore){
            this.gameState = GameState.Playerwon;

        } else if(this.rightScore >= maxScore){
            this.gameState = GameState.Aiwon
        }

        if(this.gameState === GameState.Running){
            this.resetBall();
        } else {
            this.ball.active = false;
            this.physics.world.remove(this.ball.body)

            this.scene.stop(SceneKeys.GameBackgroundScene)

            // show gameover scene
            this.scene.start(SceneKeys.GameOverScene, {
                leftScore: this.leftScore,
                rightScore: this.rightScore
            })
        }


    }


    incrementLeftScore() {
        this.leftScore += 1;
        this.leftScoreLabel.text = this.leftScore;
    }

    incrementRightScore() {
        this.rightScore += 1;
        this.rightScoreLabel.text = this.rightScore;
    }

    resetBall() {
        this.ball.setPosition(400, 250)
        const angle = Phaser.Math.Between(300, 360);
        const vec = this.physics.velocityFromAngle(angle, 200);

        this.ball.body.setVelocity(vec.x, vec.y)
    }
}