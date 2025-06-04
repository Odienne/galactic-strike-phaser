import SFX from './sfx.json';

export default class SoundSystem {
    constructor(scene) {
        this.scene = scene;
        this.bgm = this.scene.sound.add('bgm');

        this.playBgm();
    }



    playBgm() {
        this.bgm.play();
    }

    destroy() {
        this.bgm.destroy();
    }
}