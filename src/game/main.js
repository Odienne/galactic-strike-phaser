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
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    roundPixels: true, //important for pi
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
        target: 24,         // Limit to 30 FPS
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
