export default class WeaponVideoManager {
    constructor(scene) {
        this.scene = scene;

        const x = 125;
        const y = 265;

        this.laser1 = this.scene.add.video(x, y, 'laser1').setOrigin(0, 0).setDepth(-400).setVisible(false).play(true);
        this.laser2 = this.scene.add.video(x, y, 'laser2').setOrigin(0, 0).setDepth(-400).setVisible(false).play(true);
        this.laser3 = this.scene.add.video(x, y, 'laser3').setOrigin(0, 0).setDepth(-400).setVisible(false).play(true);

        this.laser1.once('play', () => {
            this.laser1.setDisplaySize(870, 510);
        });
        this.laser2.once('play', () => {
            this.laser2.setDisplaySize(870, 510).stop();
        });
        this.laser3.once('play', () => {
            this.laser3.setDisplaySize(870, 510).stop();
        });

        this.playVideo()
    }

    playVideo() {
        if (this.currentVideo !== undefined) {
            this.currentVideo.setDepth(-500);
            this.currentVideo.stop();
        }

        switch (window.currentWeapon) {
            case 1:
                this.currentVideo = this.laser1;
                break;
            case 2:
                this.currentVideo = this.laser2;
                break;
            case 3:
                this.currentVideo = this.laser3;
                break;
            default:
                this.currentVideo = this.laser1;
        }

        // Try to play video (catch silently if autoplay fails)
        try {
            this.currentVideo.setVisible(true);
            this.currentVideo.setDepth(-400);
            this.currentVideo.play(true);
        } catch (e) {
            console.warn('Video play failed:', e);
        }
    }
}
