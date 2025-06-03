export default class VideoSystemManager {
    /**
     * @param {Phaser.Scene} scene - The scene to add video to
     */
    constructor(scene) {
        this.scene = scene;

        // Add a video object offscreen initially (empty key)
        this.video = this.scene.add.video(42, 786, 'computerIdle')
            .setOrigin(0, 0)        // bottom-left anchor
            .setDepth(400);

        this.playVideo();
    }

    changeVideo(key) {
        //destroy previous video
        this.video.destroy();
        //add new video key
        this.video = this.scene.add.video(42, 786, key)
            .setOrigin(0, 0)        // bottom-left anchor
            .setDepth(400);

        this.playVideo();
    }

    playVideo() {
        // Try to play video (catch silently if autoplay fails)
        try {
            this.video.play(true)
            this.video.once('play', () => {
                this.video.setDisplaySize(477, 270);
            });
        } catch (e) {
            console.warn('Autoplay failed:', e);
        }
    }

}
