export class WeaponSystem {
    constructor(scene, grid) {
        this.scene = scene;
        this.grid = grid;
        this.currentWeapon = 1;

        this.setupInput();
    }

    setupInput() {
        ['ONE', 'TWO', 'THREE'].forEach((key, i) => {
            this.scene.input.keyboard.on(`keydown-${key}`, () => {
                this.currentWeapon = i + 1;
                console.log(`Switched to weapon ${this.currentWeapon}`);
            });
        });

        this.scene.input.keyboard.on('keydown-SPACE', () => this.fire());
    }

    fire() {
        const centerX = this.grid.colHighlight.x;
        const centerY = this.grid.rowHighlight.y;
        const spacingX = this.grid.cellWidth;
        const spacingY = this.grid.cellHeight;

        const startX = this.scene.scale.width / 2;
        const startY = this.scene.scale.height;

        let targets = [];
        let laserTexture = 'laser';
        const bottomY = (this.scene?.scale?.height ?? 1080) - 50;
        const gridWidth = 1330;

        //margin right 27px
        switch (this.currentWeapon) {
            case 1:
                laserTexture = 'laser';
                targets = [
                    {
                        startX: (gridWidth / 2) + 550,
                        startY: bottomY,
                        targetX: centerX,
                        targetY: centerY
                    }
                ];
                break;

            case 2:
                laserTexture = 'laser2';

                targets = [
                    {
                        startX: 550,
                        startY: bottomY,
                        targetX: centerX - spacingX,
                        targetY: centerY
                    },
                    {
                        startX: (gridWidth / 2) + 550,
                        startY: bottomY,
                        targetX: centerX,
                        targetY: centerY
                    },
                    {
                        startX: 1900,
                        startY: bottomY,
                        targetX: centerX + spacingX,
                        targetY: centerY
                    }
                ];
                break;
            case 3:
                laserTexture = 'laser3';
                targets = [
                    {
                        startX: (gridWidth / 2) + 550,
                        startY: bottomY,
                        targetX: centerX,
                        targetY: centerY
                    },
                    {
                        startX: 550,
                        startY: bottomY,
                        targetX: centerX - spacingX, targetY: centerY - spacingY
                    },
                    {
                        startX: 1900,
                        startY: bottomY,
                        targetX: centerX + spacingX, targetY: centerY - spacingY
                    },
                    {
                        startX: (gridWidth / 4) + 550,
                        startY: bottomY,
                        targetX: centerX - spacingX, targetY: centerY + spacingY
                    },
                    {
                        startX: ((gridWidth / 4) * 3) + 550,
                        startY: bottomY,
                        targetX: centerX + spacingX, targetY: centerY + spacingY
                    },
                ];
                break;
        }

        targets.forEach(target => {
            const sx = target.startX;
            const sy = target.startY;
            const tx = target.targetX;
            const ty = target.targetY;

            this.fireLaser(sx, sy, tx, ty, laserTexture);
        });
    }

    fireLaser(startX, startY, targetX, targetY, texture) {
        const laser = this.scene.add.sprite(startX, startY, texture)
            .setDepth(10)
            .setBlendMode(Phaser.BlendModes.ADD);

        switch (this.currentWeapon) {
            case 1:
                laser.setOrigin(0.5, 0.2)
                break;
            case 2:
                laser.setOrigin(0.5, 0.4)
                break;
            case 3:
                laser.setOrigin(0.5, 0.2)
                break;
        }

        this.scene.tweens.add({
            targets: laser,
            scaleX: {from: 1, to: 1.6},
            duration: 100,
            yoyo: true,
            repeat: -1
        });

        const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
        laser.rotation = angle + Math.PI / 2;

        // const laserHeight = (laser.displayHeight || 40) - 24;
        // const offsetX = laserHeight * Math.cos(angle);
        // const offsetY = laserHeight * Math.sin(angle);
        const adjustedTargetX = targetX;
        const adjustedTargetY = targetY;

        const speed = this.selectSpeed();
        const distance = Phaser.Math.Distance.Between(startX, startY, adjustedTargetX, adjustedTargetY);
        const duration = (distance / speed) * 1000;

        this.scene.tweens.add({
            targets: laser,
            x: adjustedTargetX,
            y: adjustedTargetY,
            duration,
            ease: 'Linear',
            onComplete: () => {
                const hit = this.grid.fireAtCell(targetX, targetY);
                if (hit) {
                    this.showExplosion(targetX, targetY);
                }

                this.scene.tweens.add({
                    targets: laser,
                    alpha: 0,
                    duration: 100,
                    onComplete: () => laser.destroy()
                });
            }
        });
    }

    showExplosion(x, y) {
        const explosion = this.selectExplosionSprite(x, y);
        this.playSelectedExplosion(explosion);
        explosion.on('animationcomplete', () => explosion.destroy());
    }

    selectExplosionSprite(x, y) {
        switch (this.currentWeapon) {
            case 1:
                return this.scene.add.sprite(x, y, 'explosion1');
            case 2:
                return this.scene.add.sprite(x, y, 'explosion2');
            case 3:
                return this.scene.add.sprite(x, y, 'explosion3');
            default:
                return this.scene.add.sprite(x, y, 'explosion1');
        }
    }

    playSelectedExplosion(explosion) {
        switch (this.currentWeapon) {
            case 1:
                return explosion.play("explode1");
            case 2:
                return explosion.play("explode2");
            case 3:
                return explosion.play("explode3");
            default:
                return explosion.play("explode1");
        }
    }

    selectSpeed() {
        switch (this.currentWeapon) {
            case 1:
                return 3600;
            case 2:
                return 3000;
            case 3:
                return 1200;
            default:
                return 3600;
        }
    }
}
