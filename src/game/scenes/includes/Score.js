// score.js
export default class Score {
    constructor(scene) {
        this.score = 0;
        this.scene = scene;

        this.scoreText = this.scene.add.text(200, 724, `SCORE: ${this.score}`, {
            fontSize: '52px',
            color: '#ffffff',
            fontFamily: 'American Captain', //american captain
        }).setDepth(10000);
    }

    add(toAdd) {

        if (toAdd < 0) {
            this.animateLosePoints();
        } else {
            this.animateGainPoints();
        }

        this.score += toAdd;
        this.scoreText.setText(`Score: ${this.score}`);

    }

    animateLosePoints() {
        // Flash and glow simulation
        this.setRedGlow(true);
        this.scene.tweens.add({
            targets: this.scoreText,
            alpha: 0.2,
            duration: 80,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                // Remove glow at the end
                this.setRedGlow(false);
                this.scoreText.setAlpha(1);
                this.scoreText.setScale(1);
            }
        });
    }
    animateGainPoints() {
        // Flash and glow simulation
        this.setGreenGlow(true);
        this.scene.tweens.add({
            targets: this.scoreText,
            alpha: 0.2,
            duration: 80,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                // Remove glow at the end
                this.setGreenGlow(false);
                this.scoreText.setAlpha(1);
                this.scoreText.setScale(1);
            }
        });
    }


    setRedGlow(enabled) {
        if (enabled) {
            this.scoreText.setStroke('#ff0000', 2);
        } else {
            this.scoreText.setStroke('#ffffff', 0);
        }
    }

    setGreenGlow(enabled) {
        if (enabled) {
            this.scoreText.setStroke('#00ff00', 2);
        } else {
            this.scoreText.setStroke('#ffffff', 0);
        }
    }
}
