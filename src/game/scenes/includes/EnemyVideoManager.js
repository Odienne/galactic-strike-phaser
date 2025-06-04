export default class EnemyVideoManager {
    /**
     * @param {Phaser.Scene} scene - The scene to add video to
     */
    constructor(scene) {
        this.scene = scene;

        const x = 42;
        const y = 42;

        this.enemyStandby = this.scene.add.video(x, y, 'enemyStandby').setOrigin(0, 0).setDepth(1000);
        this.playVideo(this.enemyStandby);

        setTimeout(() => {
            this.enemyStandby.setDepth(-10);
            this.enemyAttack = this.scene.add.video(x, y, 'enemyAttack').setOrigin(0, 0).setDepth(1000);
            this.playVideo(this.enemyAttack);
        }, 3000)
    }

    playVideo(video) {
        // Try to play video (catch silently if autoplay fails)
        try {
            video.play(true);
            video.setDepth(400);
            video.once('play', () => {
                video.setDisplaySize(473, 650);
            });
        } catch (e) {
            console.warn('Autoplay failed:', e);
        }
    }
}
