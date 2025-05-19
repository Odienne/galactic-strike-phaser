import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#028af8',
    // roundPixels: true, //important for pi
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ],
    fps: {
        target: 20,         // Limit to 20 FPS
        forceSetTimeOut: true  // Use setTimeout instead of requestAnimationFrame (important for strict limiting)
    },
    render: {
        antialias: false,
        roundPixels: true,
        maxTextures: 4,
        batchSize: 4096,
        clearBeforeRender: true,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
    }

};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
