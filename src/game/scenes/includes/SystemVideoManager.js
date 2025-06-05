export default class VideoSystemManager {
    constructor(scene) {
        this.scene = scene;

        const x = 42;
        const y = 786;

        this.videoMap = {
            computerIdle: this.scene.add.video(x, y, 'computerIdle').setOrigin(0, 0).setDepth(400).setVisible(true),
            computerDanger: this.scene.add.video(x, y, 'computerDanger').setOrigin(0, 0).setDepth(400).setVisible(true).setVolume(0.4),
        };

        this.changeVideo('computerIdle');
    }

    async changeVideo(key) {
        if (this.currentVideo !== undefined) {
            this.currentVideo.setDepth(300);
            this.currentVideo.stop();
        }

        this.currentVideo = this.videoMap[key];
        this.currentVideo.setCurrentTime(0);

        return new Promise((resolve) => {
            const handleReady = () => {
                this.currentVideo.off('play', handleReady); // clean listener
                this.currentVideo.setDisplaySize(477, 270);
                this.currentVideo.setDepth(400);
            };

            this.currentVideo.once('play', handleReady);
            this.currentVideo.setDepth(400);
            this.currentVideo.play(true);
            resolve();
        });
    }
}
