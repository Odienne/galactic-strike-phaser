import {Scene} from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);
    }
}
