import WeaponVideoManager from "./includes/WeaponVideoManager.js";

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('bg1', 'assets/bg1.png');
        this.load.image('bg2', 'assets/bg2.png');
        this.load.image('bg3', 'assets/bg3.png');

        this.load.video('laser1', 'assets/videos/laser1.webm', true);
        this.load.video('laser2', 'assets/videos/laser2.webm', true);
        this.load.video('laser3', 'assets/videos/laser3.webm', true);

        this.load.video('laser3', 'assets/videos/laser3.webm', true);
        this.load.audio('change-weapon', 'assets/sfx/01-change-weapon.mp3');

        this.loadFonts();
    }

    create() {
        this.changeWeaponAudio = this.sound.add('change-weapon');
        this.weaponsData = window.getWeaponInfos();

        this.weaponVideoManager = new WeaponVideoManager(this);

        this.initCooldownDisplay();
        this.setBackgroundImage();

        this.title = this.add.text(1920 / 2 + 20, 60, this.weaponsData[window.currentWeapon].name, {
            align: 'center',
            fontFamily: 'HemiHead',
            fontSize: '60px',
            color: '#ffffff',
            padding: 10
        })
            .setOrigin(0.5, 0.5)
            .setDepth(1000);

        this.setWeaponTitle();
        this.setupInput();
    }

    update(time, delta) {
        Object.keys(this.cooldownRects).forEach((key) => {
            const cooldownInfo = this.cooldownRects[key];
            const weaponId = cooldownInfo.weaponId;
            const weapon = window.getWeapon(weaponId);

            const elapsed = Date.now() - weapon.lastUsed;
            const ratio = Phaser.Math.Clamp(elapsed / weapon.cooldown, 0, 1);

            if (weapon.baseCooldown < elapsed) {
                if (!cooldownInfo.text.isBlinking) {
                    cooldownInfo.text.isBlinking = true;

                    // Popup + blink
                    this.tweens.add({
                        targets: cooldownInfo.text,
                        alpha: {from: 1, to: 0.6},
                        color: {from: 0xff0000, to: 0xffffff},
                        yoyo: true,
                        duration: 200,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            cooldownInfo.text.setAlpha(1); // Reset alpha
                        }
                    });

                    // Optional: tiny popup
                    this.tweens.add({
                        targets: cooldownInfo.text,
                        scale: 2,
                        yoyo: true,
                        duration: 100,
                        onComplete: () => {
                            cooldownInfo.text.setScale(1);
                        }
                    });

                    window.resetWeaponCooldown(weaponId);
                }
            } else {
                // Reset blink flag and stop tweens
                cooldownInfo.text.isBlinking = false;
                this.tweens.killTweensOf(cooldownInfo.text);
                cooldownInfo.text.setAlpha(0.2).setScale(0.92);
            }
            // Now it grows from 0 to fullWidth
            cooldownInfo.rect.width = cooldownInfo.fullWidth * ratio;

            if (window.currentWeapon === parseInt(key)) {
                this.cooldownRects[key].bgRect.setAlpha(0.6);
            } else {
                this.cooldownRects[key].bgRect.setAlpha(0);
            }
        });
    }

    setupInput() {
        ['ONE', 'TWO', 'THREE'].forEach((key, i) => {
            this.input.keyboard.on(`keydown-${key}`, () => {
                if (i + 1 !== window.currentWeapon) {
                    this.changeWeaponAudio.play();
                    window.setWeapon(i + 1);
                    this.setVideo();
                    this.setBackgroundImage();
                    this.setWeaponTitle();
                }
            });
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            if (window.isWeaponOffCoolDown(window.currentWeapon)) {
                window.updateWeaponCooldown(window.currentWeapon);
            }
        });
    }

    loadFonts() {
        this.loadFont("HemiHead", "assets/fonts/HemiHead/hemihead.otf");
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
        /*Object.entries(SFX).forEach((sfx) => {
            this.load.audio(sfx[1].name, sfx[1].src)
        });*/
    }

    setBackgroundImage() {
        switch (window.currentWeapon) {
            case 1:
                this.add.image(0, 0, 'bg1').setOrigin(0, 0).setDisplaySize(1920, 1080).setDepth(100);
                break;
            case 2:
                this.add.image(0, 0, 'bg2').setOrigin(0, 0).setDisplaySize(1920, 1080).setDepth(100);
                break;
            case 3:
                this.add.image(0, 0, 'bg3').setOrigin(0, 0).setDisplaySize(1920, 1080).setDepth(100);
                break;
            default:
                this.add.image(0, 0, 'bg1').setOrigin(0, 0).setDisplaySize(1920, 1080).setDepth(100);
        }
    }

    setWeaponTitle() {
        this.title.text = this.weaponsData[window.currentWeapon].name;
    }

    setVideo() {
        this.weaponVideoManager.playVideo();
    }

    initCooldownDisplay() {
        this.cooldownRects = {};
        const weaponsData = window.getWeaponInfos();
        const rectWidth = 1920 / 3;
        const rectHeight = 128;
        const rectY = 1080 - rectHeight;

        Object.keys(weaponsData).forEach((key, i) => {
            const weapon = weaponsData[key];
            const rectX = rectWidth * (key - 1);

            // Background full bar
            const bgRectangle = this.add.rectangle(rectX, rectY, rectWidth, rectHeight, weapon.fillColor)
                .setAlpha(0.1)
                .setDepth(890)
                .setOrigin(0, 0);


            const fillRect = this.add.rectangle(rectX, 1080 - rectHeight * 0.1, rectWidth, rectHeight * 0.1, weapon.fillColor)
                .setAlpha(1)
                .setDepth(900)
                .setOrigin(0, 0);

            this.cooldownRects[key] = {
                rect: fillRect,
                bgRect: bgRectangle,
                fullWidth: rectWidth,
                cooldown: weapon.cooldown,
                weaponId: key
            };

            // Centered text
            const centerX = rectX + rectWidth / 2;
            const centerY = rectY + rectHeight / 2;

            this.cooldownRects[key].text = this.add.text(centerX, centerY - 3, weapon.name, {
                align: 'center',
                fontFamily: 'HemiHead',
                fontSize: '38px',
                color: '#ffffff',
                padding: 10
            })
                .setOrigin(0.5, 0.5)
                .setDepth(1000);
        });
    }

}
