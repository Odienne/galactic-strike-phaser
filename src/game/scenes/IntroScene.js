export class IntroScene extends Phaser.Scene {
    constructor() {
        super('Intro');
    }

    preload() {
        this.load.video('introVideo', 'assets/videos/intro.mp4', true);
    }

    create() {
        const video = this.add.video(0, 0, "introVideo").setOrigin(0.5).setDepth(-1);
        video.play(true);
        const nativeVideo = video.video;

        if (nativeVideo.readyState >= 2) {
            resizeVideo.call(this);
        } else {
            nativeVideo.addEventListener("loadedmetadata", () => {
                resizeVideo.call(this);
            });
        }

        function resizeVideo() {
            const videoWidth = nativeVideo.videoWidth;
            const videoHeight = nativeVideo.videoHeight;
            const screenWidth = this.scale.width;
            const screenHeight = this.scale.height;
            const scaleX = screenWidth / videoWidth;
            const scaleY = screenHeight / videoHeight;
            const scale = Math.max(scaleX, scaleY);
            video.setScale(scale);
            video.setPosition(screenWidth / 2, screenHeight / 2);
        }

        video.once('complete', () => {
            this.scene.start('Game');
        });

        // Optional: allow skipping the intro
        this.input.keyboard.once('keydown-SPACE', () => {
            video.stop();
            this.scene.start('Game');
        });
    }
}
