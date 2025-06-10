export default class EnemyVideoManager {
    /**
     * @param {Phaser.Scene} scene - The scene to add video to
     */
    constructor(scene) {
        this.scene = scene;

        this.videosKeys = {
            standBy: [
                'enemyStandBy'
            ],
            attack: [
                "enemyAttack01",
                "enemyAttack02",
            ],
            furious: [
                "enemyFurious01",
                "enemyFurious02",
                "enemyFurious03",
                "enemyFurious04",
            ],
            mocking: [
                "enemyMocking01",
                "enemyMocking02",
                "enemyMocking03",
                "enemyMocking04"
            ],
            surrender: [
                "enemySurrender01",
                "enemySurrender02",
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

        this.playVideo(this.videosObjects.standBy.enemyStandBy, true, false)
    }

    selectRandomVideo(key, loop = false, standByOnComplete = true, customCallbackOnComplete = null) {
        const randomVideo = this.videosKeys[key][Math.floor(Math.random() * this.videosKeys[key].length)];
        this.playVideo(this.videosObjects[key][randomVideo], loop, standByOnComplete, customCallbackOnComplete);

        return this.videosObjects[key][randomVideo];
    }

    playRandomSurrenderVideo(completeCallback = null) {
        return this.selectRandomVideo('surrender', false, true, completeCallback);
    }

    playRandomEnemyFuriousVideo(completeCallback = null) {
        return this.selectRandomVideo('furious', false, true, completeCallback);
    }

    playRandomEnemyAttackVideo(completeCallback = null) {
        return this.selectRandomVideo('attack', false, true, completeCallback);
    }

    playRandomEnemyMockingVideo() {
        return this.selectRandomVideo('mocking');
    }

    playVideo(video, loop = false, standByOnComplete = true, customCallbackOnComplete = null) {
        //can only play one video at a time (unless it's the standBy video, override)
        if (this.currentVideo !== undefined && this.currentVideo.isPlaying() && this.currentVideo !== this.videosObjects.standBy.enemyStandBy) {

            //still run callback, needs a timeout when all ships are sunk call
            if (customCallbackOnComplete) {
                setTimeout(() => {
                    customCallbackOnComplete();
                }, 1000);
            }
            return false;
        }

        if (this.currentVideo !== undefined) {
            this.currentVideo.setDepth(300);
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

            if (standByOnComplete) {
                video.once('complete', () => {
                    this.selectRandomVideo('standBy', true, false);
                })
            }
            if (customCallbackOnComplete) {
                video.once('complete', () => {
                    customCallbackOnComplete();
                })
            }

        } catch (e) {
            console.warn('Video play failed:', e);
        }
    }
}
