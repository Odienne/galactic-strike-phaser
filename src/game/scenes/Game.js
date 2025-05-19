export class Game extends Phaser.Scene {
    rowHighlight;
    colHighlight;
    viewfinder;
    missile;

    missileSound;
    explosionSound;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
    }

    createGrid() {
        const cols = 10;
        const rows = 10;

        // Fill full width and height
        const cellWidth = this.scale.width / cols;
        const cellHeight = this.scale.height / rows;

        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.gridCols = cols;
        this.gridRows = rows;

        const graphics = this.add.graphics({lineStyle: {width: 1, color: 0xffffff, alpha: 0.3}});

        // Vertical lines
        for (let i = 0; i <= cols; i++) {
            graphics.strokeLineShape(new Phaser.Geom.Line(i * cellWidth, 0, i * cellWidth, this.scale.height));
        }

        // Horizontal lines
        for (let j = 0; j <= rows; j++) {
            graphics.strokeLineShape(new Phaser.Geom.Line(0, j * cellHeight, this.scale.width, j * cellHeight));
        }
    }

    animateHighlights() {

        const cellWidth = this.cellWidth;
        const cellHeight = this.cellHeight;
        const cols = this.gridCols;
        const rows = this.gridRows;

        this.rowHighlight = this.add.rectangle(0, 0, this.scale.width, cellHeight, 0xff0000, 0.2).setOrigin(0, 0.5);
        this.colHighlight = this.add.rectangle(0, 0, cellWidth, this.scale.height, 0x0000ff, 0.2).setOrigin(0.5, 0);

        // Add input keys
        let rowTween;
        let colTween;

// Animate row
        const startRowTween = () => {
            rowTween = this.tweens.add({
                targets: this.rowHighlight,
                y: {
                    from: this.rowHighlight.y,
                    to: this.rowHighlight.y === this.scale.height - cellHeight / 2
                        ? cellHeight / 2
                        : this.scale.height - cellHeight / 2
                },
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        };

// Animate column
        const startColTween = () => {
            colTween = this.tweens.add({
                targets: this.colHighlight,
                x: {
                    from: this.colHighlight.x,
                    to: this.colHighlight.x === this.scale.width - cellWidth / 2
                        ? cellWidth / 2
                        : this.scale.width - cellWidth / 2
                },
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        };

        const snapToNearestRow = () => {
            const relativeY = this.rowHighlight.y;
            let snappedRow = Math.round(relativeY / cellHeight);
            snappedRow = Phaser.Math.Clamp(snappedRow, 0, rows - 1);
            this.rowHighlight.y = snappedRow * cellHeight + cellHeight / 2;
        };

        const snapToNearestCol = () => {
            const relativeX = this.colHighlight.x;
            let snappedCol = Math.round(relativeX / cellWidth);
            snappedCol = Phaser.Math.Clamp(snappedCol, 0, cols - 1);
            this.colHighlight.x = snappedCol * cellWidth + cellWidth / 2;
        };

// Initialize tweens
        startRowTween();
        startColTween();

// Handle Q: pause and resume with new tween
        this.input.keyboard.on('keydown-Q', () => {
            rowTween.pause();
            snapToNearestRow();
        });

        this.input.keyboard.on('keyup-Q', () => {
            rowTween.stop();
            startRowTween(); // resume from snapped position
        });

// Handle D: pause and resume with new tween
        this.input.keyboard.on('keydown-D', () => {
            colTween.pause();
            snapToNearestCol();
        });

        this.input.keyboard.on('keyup-D', () => {
            colTween.stop();
            startColTween(); // resume from snapped position
        });
    }

    addViewfinder() {
        this.viewfinder = this.add.graphics();
        this.viewfinder.lineStyle(2, 0xffff00);
        this.viewfinder.strokeLineShape(new Phaser.Geom.Line(-10, 0, 10, 0));
        this.viewfinder.strokeLineShape(new Phaser.Geom.Line(0, -10, 0, 10));
        this.viewfinder.setDepth(10);
    }

    addVideo() {
        const video = this.add.video(0, 0, 'bgVideo').setOrigin(0.5).setDepth(-1);
        video.play(true);

        const nativeVideo = video.video; // Access native HTMLVideoElement

        if (nativeVideo.readyState >= 2) {
            resizeVideo.call(this);
        } else {
            nativeVideo.addEventListener('loadedmetadata', () => {
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
    }

    addBackground() {
        const bg = this.add.image(0, 0, 'bg')
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);    }

    create() {

        this.addBackground();
        this.createGrid();
        this.animateHighlights();
        this.addViewfinder();

        // Set up sounds
        this.missileSound = this.sound.add('missileSound');
        this.explosionSound = this.sound.add('explosionSound');

        // Explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 23, first: 23}),
            frameRate: 20,
            hideOnComplete: true
        });

        // Launch missile on S
        this.input.keyboard.on('keydown-S', () => {
            if (this.missile) return; // Prevent refiring

            const startX = this.cameras.main.centerX;
            const startY = this.cameras.main.height;

            const targetX = this.colHighlight.x;
            const targetY = this.rowHighlight.y;

            // Create missile
            this.missile = this.add.sprite(startX, startY, 'missile').setDepth(10);

            // Rotate to face target
            const angleRad = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
            this.missile.setRotation(angleRad);

            // Play missile sound
            this.missileSound.play();

            // Move to target
            const distance = Phaser.Math.Distance.Between(startX, startY, targetX, targetY);
            const speed = 300; // px/sec
            const duration = (distance / speed) * 1000;

            this.tweens.add({
                targets: this.missile,
                x: targetX,
                y: targetY,
                duration,
                ease: 'Linear',
                onComplete: () => {
                    // Play explosion sound
                    this.explosionSound.play();

                    // Play explosion animation
                    const explosion = this.add.sprite(targetX, targetY, 'explosion').setDepth(20);
                    explosion.play('explode');

                    // Clean up
                    this.missile?.destroy();
                    this.missile = null;
                }
            });
        });

        this.allowFullscreen();
    }

    allowFullscreen() {
        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
    }

    update() {
        if (this.viewfinder && this.colHighlight && this.rowHighlight) {
            this.viewfinder.setPosition(this.colHighlight.x, this.rowHighlight.y);
        }
    }
}
