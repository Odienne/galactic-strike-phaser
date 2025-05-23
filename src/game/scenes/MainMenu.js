import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // this.add.image(512, 384, 'background');

        this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo').setOrigin(0.5, 0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 120, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
