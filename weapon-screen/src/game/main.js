import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { Preloader } from './scenes/Preloader';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.WEBGL,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    // backgroundColor: '#028af8',
    // roundPixels: true, //important for pi
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [
        Boot,
        Preloader,
        MainGame,
        GameOver,
    ],
    fps: {
        target: 30,
        forceSetTimeOut: true  // Use setTimeout instead of requestAnimationFrame (important for strict limiting)
    },
    disableVisibilityChange: true,
    render: {
        antialias: true,
        roundPixels: false,
        maxTextures: 20,
        batchSize: 4096,
        clearBeforeRender: true,
        failIfMajorPerformanceCaveat: false,
        transparent: false
    }
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;
