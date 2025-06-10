import {Scene} from 'phaser';
import StartGame from "../main.js";

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.text(1920/2, 1080/2, 'Temps écoulé', {
            fontFamily: 'GothamNarrow', fontSize: 64, color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);
    }
}
