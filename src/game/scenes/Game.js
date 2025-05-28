import {Grid} from './includes/Grid.js';
import {Viewfinder} from './includes/Viewfinder.js';
import {WeaponSystem} from './includes/WeaponSystem.js';
import {addVideoBackground} from './includes/VideoBackground.js';
import {addOverlay} from './includes/UIOverlay.js';
import CountdownTimer from './includes/CountdownTimer.js';
import Score from "./includes/Score.js";
import EnemyAttackSystem from "./includes/EnemyAttackSystem.js";

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('uiOverlay', 'assets/ui-overlay.png');
        this.load.image('viewfinder', 'assets/viewfinder.png');
        this.load.image('bgFallback', 'assets/bg.png');
        this.load.image('missile', 'assets/missile.png');
        this.load.video('bgVideo', 'assets/bg_video.webm', true);
        this.load.spritesheet('explosion', 'assets/explosion3.png', {
            frameWidth: 512,
            frameHeight: 512,
            endFrame: 63,
        });

        this.load.image('ship5', 'assets/ships/ship5.png');
        this.load.image('ship3', 'assets/ships/ship3.png');
        this.load.image('ship2a', 'assets/ships/ship2a.png');
        this.load.image('ship2b', 'assets/ships/ship2b.png');
        this.load.image('ship1', 'assets/ships/ship1.png');
    }

    create() {
        this.addOverlay = addOverlay(this);

        this.score = new Score(this);
        this.timer = new CountdownTimer(this);
        this.grid = new Grid(this);
        this.grid.createGrid();
        this.grid.animateHighlights();
        this.enemyAttackSystem = new EnemyAttackSystem(this.score, this.grid);

        this.viewfinder = new Viewfinder(this);
        this.viewfinder.addViewfinder();

        this.weaponSystem = new WeaponSystem(this, this.grid);

        addVideoBackground(this, this.grid.gridStartX, this.grid.gridStartY, this.grid.gridWidth, this.grid.gridHeight);


        const totalFrames = 100;
        const desiredDurationMs = 1200;
        const frameRate = totalFrames / (desiredDurationMs / 1000);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 63, first: 0}),
            frameRate,
            hideOnComplete: true,
        });

        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
    }

    update() {
        this.viewfinder.update(this.grid.colHighlight, this.grid.rowHighlight);
    }
}
