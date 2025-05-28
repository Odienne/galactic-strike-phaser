// CountdownTimer.js
import {GameOver} from "../GameOver.js";

export default class CountdownTimer {
    constructor(scene) {
        this.scene = scene;
        this.duration = 180;

        this.text = scene.add.text(100, 1000, this.formatTime(this.duration), {
            fontSize: '42px',
            color: '#ffffff',
            fontFamily: 'monospace',
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

        this.text.setText(this.formatTime(this.duration));

        if (this.duration <= 0) {
            this.timerEvent.remove();
            console.log('game over')

            this.scene.scene.start('GameOver');
        }
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
}
