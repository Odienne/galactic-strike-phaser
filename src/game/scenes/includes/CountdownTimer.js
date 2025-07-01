// CountdownTimer.js
import {GameOver} from "../GameOver.js";
import {signalTime} from "../../../signals.js";

export default class CountdownTimer {
    constructor(scene) {
        this.scene = scene;
        this.duration = 180;

        this.text = scene.add.text(146, 22, this.scene.translator.translate('time_remaining').toUpperCase() + this.formatTime(this.duration), {
            fontSize: '22px',
            fontWeight: 'bold',
            letterSpacing: 3,
            color: '#ffffff',
            fontFamily: 'GothamNarrow', //gotham narrow et bold sur le timer
        }).setOrigin(0, 0).setDepth(10000);

        this.timerEvent = scene.time.addEvent({
            delay: 1000,
            callback: this.tick,
            callbackScope: this,
            loop: true,
        });
    }

    tick() {
        this.duration--;

        this.text.setText(this.scene.translator.translate('time_remaining').toUpperCase() + this.formatTime(this.duration));

        if (this.duration <= 0) {
            this.timerEvent.remove();

            this.transitionToGameOver();
        }

        signalTime(180 - this.duration);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    destroy() {
        this.text.destroy();
        this.timerEvent.remove();
    }

    transitionToGameOver() {
        // FX
        const pixelated = this.scene.cameras.main.postFX.addPixelate(-1);
        this.scene.add.tween({
            targets: pixelated,
            duration: 700,
            amount: 40,
            onComplete: () => {
                this.scene.socket.transitionToGameOver();
                this.scene.cameras.main.fadeOut(100);
                this.scene.enemyAttackSystem.destroy();
                this.scene.scene.start('GameOver', {translator: this.scene.translator});
            }
        })
    }
}
