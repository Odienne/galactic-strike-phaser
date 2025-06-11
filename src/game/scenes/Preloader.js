import {Scene} from 'phaser';
import SFX from "./includes/sfx.json";

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        const x = (1920 / 2);
        const y = (1080 / 2) - 30;

        const height = 60;
        const width = 600 - height / 2
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(x, y, width, height).setStrokeStyle(1, 0xffffff).setOrigin(0.5);
        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle((x-width/2) + 4, y, 4, height - 4, 0xffffff).setOrigin(0.5);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = (width * progress) - 4;
        });
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
        this.scene.start('Game');
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
