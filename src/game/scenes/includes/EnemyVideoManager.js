export default class EnemyVideoManager {
    /**
     * @param {Phaser.Scene} scene - The scene to add video to
     */
    constructor(scene) {
        this.scene = scene;

        this.videosKeys = {
            standBy: [
                'enemyStandby'
            ],
            attack: [
                "enemyAttack01",
                "enemyAttack02",
                "enemyAttack03"
            ],
            furious: [
                "enemyFurious01",
                "enemyFurious02",
                "enemyFurious03",
                "enemyFurious04"
            ],
            mocking: [
                "enemyMocking01",
                "enemyMocking02",
                "enemyMocking03"
            ],
            surrender: [
                "enemySurrender01",
                "enemySurrender02"
            ]
        }

        this.videosObjects = [];

        const x = 42;
        const y = 42;

        Object.keys(this.videosKeys).forEach(key => {
            this.videosKeys[key].forEach(videoKey => {
                if (this.videosObjects[key] === undefined) {
                    this.videosObjects[key] = {};
                }
                this.videosObjects[key][videoKey] = this.scene.add.video(x, y, videoKey).setOrigin(0, 0).setDepth(300);
            });
        });

        this.playVideo(this.videosObjects['mocking']['enemyMocking01'], true)
        this.currentVideo = this.videosObjects['mocking']['enemyMocking01'];

        setInterval(() => {
            //play a random video
            const randomKey = Object.keys(this.videosKeys)[Math.floor(Math.random() * Object.keys(this.videosKeys).length)];
            const randomVideo = this.videosKeys[randomKey][Math.floor(Math.random() * this.videosKeys[randomKey].length)];
            this.playVideo(this.videosObjects[randomKey][randomVideo]);
        }, 3000)
    }

    playVideo(video, loop = false) {
        if (this.currentVideo) {
            this.currentVideo.setDepth(300);
            this.currentVideo.setVisible(false);
            this.currentVideo.stop();
        }

        // Try to play video (catch silently if autoplay fails)
        try {
            this.currentVideo = video;
            video.setVisible(true);
            video.play(loop);
            video.setDepth(500);
            video.once('play', () => {
                video.setDisplaySize(473, 650);
            });
        } catch (e) {
            console.warn('Video play failed:', e);
        }
    }
}
