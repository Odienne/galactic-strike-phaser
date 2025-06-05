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
import SFX from './includes/sfx.json';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('uiOverlay', 'assets/ui-overlay.png');
        this.load.image('redAlertLeft', 'assets/red-alert-gradient-left.png');
        this.load.image('redAlertRight', 'assets/red-alert-gradient-right.png');
        this.load.image('viewfinder', 'assets/viewfinder.png');
        this.load.image('viewfinder2', 'assets/viewfinder2.png');
        this.load.image('viewfinder3', 'assets/viewfinder3.png');

        this.load.image('bgFallback', 'assets/bg.png');
        this.load.image('top-curtain', 'assets/top-curtain.png');
        this.load.image('bottom-curtain', 'assets/bottom-curtain.png');


        this.load.image('laser', 'assets/laser.png');
        this.load.image('laser2', 'assets/laser2.png');
        this.load.image('laser3', 'assets/laser3.png');

        this.load.video('computerIdle', 'assets/videos/computer/computer-idle.webm');
        this.load.video('computerDanger', 'assets/videos/computer/computer-danger.webm');

        this.load.video('bgVideo', 'assets/bg_video.webm', true);

        this.load.spritesheet('explosion1', 'assets/explosions/explosion1.png', {
            frameWidth: 128,
            frameHeight: 128,
            endFrame: 63,
        });

        this.load.spritesheet('explosion2', 'assets/explosions/explosion2.png', {
            frameWidth: 128,
            frameHeight: 128,
            endFrame: 63,
        });

        this.load.spritesheet('explosion3', 'assets/explosions/explosion3.png', {
            frameWidth: 128,
            frameHeight: 128,
            endFrame: 63,
        });

        this.load.spritesheet('explosionFinal', 'assets/explosion-final.png', {
            frameWidth: 128,
            frameHeight: 128,
            endFrame: 63,
        });

        this.load.image('ship5', 'assets/ships/ship5.png');
        this.load.image('ship3', 'assets/ships/ship3.png');
        this.load.image('ship2a', 'assets/ships/ship2a.png');
        this.load.image('ship2b', 'assets/ships/ship2b.png');
        this.load.image('ship1', 'assets/ships/ship1.png');

        /*particles*/
        this.load.atlas('explosion', 'assets/particles/explosion.png', 'assets/particles/explosion.json');

        this.loadFonts();

        this.preloadAudio();
        this.preloadEnemyVideos();
    }

    create() {
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                console.log('FPS:', this.game.loop.actualFps.toFixed(1));
            }
        });

        addOverlay(this);

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

    loadFonts() {
        this.loadFont("American Captain", "assets/fonts/AmericanCaptain/AmericanCaptain.otf");
        this.loadFont("GothamNarrow", "assets/fonts/Gotham/GothamNarrow-Medium.otf");
    }

    loadFont(name, url) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }

    preloadAudio() {
        Object.entries(SFX).forEach((sfx) => {
            this.load.audio(sfx[1].name, sfx[1].src)
        });
    }

    preloadEnemyVideos() {
        this.load.video('enemyStandBy', 'assets/videos/enemy/enemy-standby.webm', true);

        this.load.video('enemyAttack01', 'assets/videos/enemy/enemy-attack-01.webm');
        this.load.video('enemyAttack02', 'assets/videos/enemy/enemy-attack-02.webm');

        this.load.video('enemyFurious01', 'assets/videos/enemy/enemy-furious-01.webm');
        this.load.video('enemyFurious02', 'assets/videos/enemy/enemy-furious-02.webm');
        this.load.video('enemyFurious03', 'assets/videos/enemy/enemy-furious-03.webm');
        this.load.video('enemyFurious04', 'assets/videos/enemy/enemy-furious-04.webm');

        this.load.video('enemyMocking01', 'assets/videos/enemy/enemy-mocking-01.webm');
        this.load.video('enemyMocking02', 'assets/videos/enemy/enemy-mocking-02.webm');
        this.load.video('enemyMocking03', 'assets/videos/enemy/enemy-mocking-03.webm');
        this.load.video('enemyMocking04', 'assets/videos/enemy/enemy-mocking-04.webm');

        this.load.video('enemySurrender01', 'assets/videos/enemy/enemy-surrender-01.webm');
        this.load.video('enemySurrender02', 'assets/videos/enemy/enemy-surrender-02.webm');
    }
}
