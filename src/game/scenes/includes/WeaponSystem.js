export class WeaponSystem {
    constructor(scene, grid) {
        this.scene = scene;
        this.grid = grid;
        this.currentWeapon = 1;
        this.missiles = [];

        this.setupListeners();

        this.laser = this.scene.add.graphics();
        this.laser.setDepth(11);
    }

    setupListeners() {
        ['ONE', 'TWO', 'THREE'].forEach((key, i) => {
            this.scene.input.keyboard.on(`keydown-${key}`, () => {
                this.currentWeapon = i + 1;
                console.log(`Switched to weapon ${this.currentWeapon}`);
            });
        });

        this.scene.input.keyboard.on('keydown-S', () => this.fire());

        this.scene.input.keyboard.on('keydown-SPACE', () => {
            const targetX = this.grid.colHighlight.x;
            const targetY = this.grid.rowHighlight.y;
            this.fireLaserProjectile(targetX, targetY);
        });
    }

    fire() {
        if (this.missiles.length > 0) return;  // already firing

        const startX = this.scene.cameras.main.centerX;
        const startY = this.scene.cameras.main.height;
        const centerX = this.grid.colHighlight.x;
        const centerY = this.grid.rowHighlight.y;
        const spacingX = this.grid.cellWidth;
        const spacingY = this.grid.cellHeight;

        let targets = [];

        switch (this.currentWeapon) {
            case 1:
                targets = [{ x: centerX, y: centerY }];
                break;
            case 2:
                targets = [
                    { x: centerX - spacingX, y: centerY },
                    { x: centerX, y: centerY },
                    { x: centerX + spacingX, y: centerY }
                ];
                break;
            case 3:
                targets = [
                    { x: centerX, y: centerY },
                    { x: centerX - spacingX, y: centerY - spacingY },
                    { x: centerX + spacingX, y: centerY - spacingY },
                    { x: centerX - spacingX, y: centerY + spacingY },
                    { x: centerX + spacingX, y: centerY + spacingY }
                ];
                break;
        }

        this.missiles = [];

        targets.forEach(target => {
            const missile = this.launchMissile(startX, startY, target.x, target.y);
            this.missiles.push(missile);
        });
    }

    launchMissile(startX, startY, targetX, targetY) {
        const missile = this.scene.add.sprite(startX, startY, 'missile').setDepth(10);
        const angleRad = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
        missile.setRotation(angleRad);

        const distance = Phaser.Math.Distance.Between(startX, startY, targetX, targetY);
        const speed = 1200;
        const duration = (distance / speed) * 1000;

        this.scene.tweens.add({
            targets: missile,
            x: targetX,
            y: targetY,
            duration,
            ease: 'Linear',
            onComplete: () => {
                const hit = this.grid.fireAtCell(targetX, targetY);
                if(hit) {
                    this.showExplosion(targetX, targetY);
                } else {
                }

                missile.destroy();

                // Remove this missile from missiles array
                const index = this.missiles.indexOf(missile);
                if (index !== -1) {
                    this.missiles.splice(index, 1);
                }
            }
        });

        return missile;
    }

    fireLaserProjectile(targetX, targetY) {
        const startX = this.scene.scale.width / 2;
        const startY = this.scene.scale.height;

        // Create laser graphic
        const laser = this.scene.add.rectangle(startX, startY, 8, 40, 0xff0000)
            .setOrigin(0.5, 1)
            .setDepth(10);

        laser.setBlendMode(Phaser.BlendModes.ADD);

        this.scene.tweens.add({
            targets: laser,
            width: { from: 8, to: 12 },
            duration: 100,
            yoyo: true,
            repeat: -1
        });

        // Calculate angle to target
        const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
        laser.rotation = angle + Math.PI / 2;

        const speed = 800;
        const distance = Phaser.Math.Distance.Between(startX, startY, targetX, targetY);
        const duration = (distance / speed) * 1000;

        this.scene.tweens.add({
            targets: laser,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                // Check if hit or miss using grid method
                const hit = this.grid.fireAtCell(targetX, targetY);
                if(hit) {
                    console.log("Hit!");
                } else {
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

    showExplosion(targetX, targetY) {
        const explosion = this.scene.add.sprite(targetX, targetY, 'explosion').setDepth(20).setScale(0.6);
        explosion.play('explode');
        explosion.on('animationcomplete', () => explosion.destroy());
    }
}
