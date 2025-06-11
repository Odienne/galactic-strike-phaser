import {Grid} from './includes/Grid.js';
import {Viewfinder} from './includes/Viewfinder.js';
import {WeaponSystem} from './includes/WeaponSystem.js';
import {addVideoBackground} from './includes/VideoBackground.js';
import {addOverlay} from './includes/UIOverlay.js';
import CountdownTimer from './includes/CountdownTimer.js';
import Score from "./includes/Score.js";
import EnemyAttackSystem from "./includes/EnemyAttackSystem.js";
import VideoSystemManager from "./includes/SystemVideoManager.js";
import EnemyVideoManager from "./includes/EnemyVideoManager.js";
import SoundSystem from "./includes/SoundSystem.js";
import Socket from './includes/Socket.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        addOverlay(this);

        this.socket = new Socket(this);
        this.score = new Score(this);
        this.timer = new CountdownTimer(this)

        this.soundSystem = new SoundSystem(this);
        this.enemyVideoManager = new EnemyVideoManager(this);
        this.systemVideoManager = new VideoSystemManager(this);

        this.grid = new Grid(this, this.enemyVideoManager);


        this.bgVideo = addVideoBackground(this, this.grid.gridStartX, this.grid.gridStartY, this.grid.gridWidth, this.grid.gridHeight);

        this.generatesTextures();
        this.placeCurtains();


        setTimeout(() => {
            this.enemyVideoManager.playRandomEnemyAttackVideo(() => this.startPlayerGamePlay());
        }, 3000)
    }

    startPlayerGamePlay() {
        this.weaponSystem = new WeaponSystem(this, this.grid, this.soundSystem);
        this.viewfinder = new Viewfinder(this, this.weaponSystem);
        this.enemyAttackSystem = new EnemyAttackSystem(this, this.score, this.systemVideoManager, this.enemyVideoManager, this.soundSystem);
        this.slideCurtains();
    }

    update() {
        if (this.viewfinder) {
            this.viewfinder.update(this.grid.colHighlight, this.grid.rowHighlight);
        }
    }

    generatesTextures() {
        const totalFrames = 100;
        const desiredDurationMs = 1200;
        const frameRate = totalFrames / (desiredDurationMs / 1000);

        this.anims.create({
            key: 'explode1',
            frames: this.anims.generateFrameNumbers('explosion1', {start: 0, end: 63, first: 0}),
            frameRate,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'explode2',
            frames: this.anims.generateFrameNumbers('explosion2', {start: 0, end: 63, first: 0}),
            frameRate,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'explode3',
            frames: this.anims.generateFrameNumbers('explosion3', {start: 0, end: 63, first: 0}),
            frameRate,
            hideOnComplete: true,
        });
    }

    slideCurtains() {
        this.soundSystem.playCurtainOpen();

        // Slide top curtain up (off screen)
        this.tweens.add({
            targets: this.topCurtain,
            y: -this.topCurtain.displayHeight,
            ease: 'Power2',
            duration: 3600
        });

        // Slide bottom curtain down (off screen)
        this.tweens.add({
            targets: this.bottomCurtain,
            y: 1080,
            ease: 'Power2',
            duration: 3600
        });
    }

    placeCurtains() {
        //place the bottom and top curtains
        this.topCurtain = this.add.image(550, 0, 'top-curtain')
            .setDepth(200) // on top of viewfinder
            .setOrigin(0, 0);   // anchor top center
        this.topCurtain.setDisplaySize(this.grid.gridWidth, 1080 / 2);

        this.bottomCurtain = this.add.image(550, 1080 / 2, 'bottom-curtain')
            .setDepth(200) // on top of viewfinder
            .setOrigin(0, 0);   // anchor bottom center
        this.bottomCurtain.setDisplaySize(this.grid.gridWidth, 1080 / 2);
    }
}
