import SFX from './sfx.json';

export default class SoundSystem {
    constructor(scene) {
        this.scene = scene;
        this.bgm = this.scene.sound.add('bgm');
        this.curtainOpen = this.scene.sound.add('curtain_open');
        this.shipExplosion = this.scene.sound.add('ship_explosion');
        this.attackParried = this.scene.sound.add('attack_parried');
        this.playerShipExplosion = this.scene.sound.add('player_explosion');
        this.laser1 = this.scene.sound.add('laser1');
        this.laser2 = this.scene.sound.add('laser2');
        this.laser3 = this.scene.sound.add('laser3');
        this.cantFire = this.scene.sound.add('cantFire');
        this.lock = this.scene.sound.add('lock');
        this.doubleLock = this.scene.sound.add('double_lock');

        this.playBgm();

        this.scene.input.once('pointerdown', () => {
            if (this.scene.sound.context.state === 'suspended') {
                this.scene.sound.context.resume();
            }
        });
    }


    playBgm() {
        this.bgm.setVolume(0.3);
        this.bgm.play();
    }

    playExplosion() {
        this.shipExplosion.setVolume(0.5);
        this.shipExplosion.play();
    }

    playAttackParried() {
        this.attackParried.setVolume(0.8);
        this.attackParried.play();
    }

    playCantFire() {
        this.cantFire.setVolume(0.8);
        this.cantFire.play();
    }

    playLock() {
        this.lock.setVolume(0.8);
        this.lock.play();
    }
    playDoubleLock() {
        this.doubleLock.setVolume(0.8);
        this.doubleLock.play();
    }

    playPlayerShipExplosion() {
        this.playerShipExplosion.setVolume(0.5);
        this.playerShipExplosion.play();
    }
    playCurtainOpen() {
        this.curtainOpen.setVolume(1);
        this.curtainOpen.play();
    }

    playLaser(weaponId) {
        switch (weaponId) {
            case 1:
                this.laser1.setVolume(0.4);
                this.laser1.play();
                break;
            case 2:
                this.laser2.setVolume(0.4);
                this.laser2.play();
                break;
            case 3:
                this.laser3.setVolume(0.4);
                this.laser3.play();
                break;
        }

    }

    destroy() {
        this.bgm.destroy();
    }
}