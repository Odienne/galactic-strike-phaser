export default class EnemyAttackSystem {
    constructor(scene, scoreModule, systemVideoManager, enemyVideoManager, soundSystem) {
        this.scene = scene;
        this.scoreModule = scoreModule;
        this.systemVideoManager = systemVideoManager;
        this.enemyVideoManager = enemyVideoManager;
        this.soundSystem = soundSystem;

        this.attackBox = null;
        this.currentAttackSide = null;
        this.attackTimeoutId = null;
        this.defendTimeoutId = null;
        this.canDefend = false;

        // Bind methods to this
        this.handleKeyDown = this.handleKeyDown.bind(this);

        window.addEventListener('keydown', this.handleKeyDown);

        this.attackScheduled = false;
        this.scheduleNextAttack(true);
        this.createAttackFlash();

        window.defendLeft = () => {
            if (!this.canDefend || !this.currentAttackSide) return;

            if (this.currentAttackSide === 'left') {
                this.resolveAttack(true);
            }
        }
        window.defendRight = () => {
            if (!this.canDefend || !this.currentAttackSide) return;

            if (this.currentAttackSide === 'right') {
                this.resolveAttack(true);
            }
        }
    }

    nextRandomAttackTimer() {
        let min = 12000;
        let max = 20000;

        if (this.scene.timer.duration < 120) {
            min = 8000;
            max = 14000;
        } else if (this.scene.timer.duration < 60) {
            min = 6000;
            max = 10000;
        }

        return Math.random() * (max - min) + min;
    }

    async scheduleNextAttack(playAttackVideo = false) {
        if (this.attackScheduled) {
            console.warn('Attack already scheduled, skipping');
            return;
        }

        this.attackScheduled = true;

        if (this.attackTimeoutId) {
            clearTimeout(this.attackTimeoutId);
            this.attackTimeoutId = null;
        }

        await this.systemVideoManager.changeVideo('computerIdle');

        this.attackTimeoutId = setTimeout(() => {
            this.attackScheduled = false;
            this.triggerAttack(playAttackVideo);
        }, this.nextRandomAttackTimer());
    }

    async triggerAttack(playAttackVideo = false) {
        if (playAttackVideo) {
            this.enemyVideoManager.playRandomEnemyAttackVideo(() => {
                this.handleAttackBoxAndDefendTimer();
            });
        } else {
            this.handleAttackBoxAndDefendTimer();
        }
    }

    async handleAttackBoxAndDefendTimer() {
        await this.systemVideoManager.changeVideo('computerDanger');
        this.canDefend = true;
        this.currentAttackSide = Math.random() < 0.5 ? 'left' : 'right';

        this.flashAttack(this.currentAttackSide);

        this.defendTimeoutId = setTimeout(() => {
            this.resolveAttack(false);
            this.attackScheduled = false; // Just in case
        }, 2000);
    }

    handleKeyDown(event) {
        if (!this.canDefend || !this.currentAttackSide) return;

        const key = event.key.toLowerCase();

        // 'k' for left defense, 'l' for right defense
        if ((key === 'k' && this.currentAttackSide === 'left') ||
            (key === 'l' && this.currentAttackSide === 'right')) {
            this.resolveAttack(true);
        }
    }

    async resolveAttack(defended) {
        if (!this.canDefend) return; // Prevent double call
        this.canDefend = false;

        if (this.defendTimeoutId) {
            clearTimeout(this.defendTimeoutId);
            this.defendTimeoutId = null;
        }

        if (defended) {
            this.soundSystem.playAttackParried();
            this.scoreModule.add(10);
            this.setAttackBoxDefended();
        } else {
            this.soundSystem.playPlayerShipExplosion();
            this.clearAttackTween();
            this.triggerScreenShake();
            this.scoreModule.add(-30);
            this.scene.time.delayedCall(800, () => {
                this.enemyVideoManager.playRandomEnemyMockingVideo();
            })
        }

        this.scheduleNextAttack();
    }


    createAttackFlash() {
        const screenWidth = this.scene.scale.width;

        this.attackFlashLeft = this.scene.add.image(0, 0, 'redAlertLeft').setOrigin(0, 0).setDisplaySize(400, 1080).setDepth(1000).setAlpha(0).setVisible(0);
        this.attackFlashRight = this.scene.add.image(screenWidth, 0, 'redAlertRight').setOrigin(1, 0).setDisplaySize(400, 1080).setDepth(1000).setAlpha(0).setVisible(0);
    }

    flashAttack(direction = 'left') {
        this.target = this.attackFlashLeft;
        if (direction === 'right') {
            this.target = this.attackFlashRight;
        } else {
            this.target = this.attackFlashLeft;
        }

        this.target.setVisible(true);
        this.target.setAlpha(1); // start visible for tweening
        this.target.setTintFill(0xff0000);

        this.currentTweenAttack = this.scene.tweens.add({
            targets: this.target,
            scaleX: {from: 0.8, to: 1.3},
            alpha: {from: 0.6, to: 1},
            duration: 500,
            yoyo: true,
            repeat: 4,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.hideTarget();
            }
        });
    }

    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        if (this.attackTimeoutId) clearTimeout(this.attackTimeoutId);
        if (this.defendTimeoutId) clearTimeout(this.defendTimeoutId);
    }

    triggerScreenShake() {
        // Create or reuse flash overlay
        if (!this.redFlashOverlay) {
            this.redFlashOverlay = this.scene.add.graphics();
            this.redFlashOverlay.fillStyle(0xff0000, 0.5); // RGBA red
            this.redFlashOverlay.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
            this.redFlashOverlay.setScrollFactor(0); // Lock to camera
            this.redFlashOverlay.setDepth(1000); // On top
        }

        this.redFlashOverlay.setAlpha(0); // reset
        this.redFlashOverlay.setVisible(true);

        // Flash tween (simulate CSS animation)
        this.scene.tweens.killTweensOf(this.redFlashOverlay); // cancel previous
        this.scene.tweens.add({
            targets: this.redFlashOverlay,
            alpha: {from: 1, to: 0.6},
            duration: 200,
            yoyo: true,
            repeat: 1,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.redFlashOverlay.setVisible(false);
            }
        });

        // Shake the camera
        this.scene.cameras.main.shake(1000, 0.03); // duration in ms, intensity
    }

    clearAttackTween() {
        //clear tween if exist
        if (this.currentTweenAttack) {
            this.currentTweenAttack.complete();
            this.hideTarget();
        }
    }

    setAttackBoxDefended() {
        //set target to green
        this.target.setTintFill(0x00ff00);
        if (this.currentTweenAttack) {
            this.currentTweenAttack.stop();
        }
        setTimeout(() => {
            this.clearAttackTween();
        }, 600)
    }

    hideTarget() {
        this.target.setVisible(false);
        this.target.setAlpha(0);
    }
}
