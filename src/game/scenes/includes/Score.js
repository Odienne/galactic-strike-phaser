// score.js
export default class Score {
    constructor(scene) {
        this.score = 0;

        this.scene = scene;
        this.scoreText = this.scene.add.text(100, 860, `Score: ${this.score}`, {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'monospace',
        }).setDepth(10000);
    }

    add(toAdd) {
        this.score += toAdd;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}
