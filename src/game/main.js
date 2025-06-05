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
        GameOver
    ],
    fps: {
        target: 60,
        forceSetTimeOut: true  // Use setTimeout instead of requestAnimationFrame (important for strict limiting)
    },
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

    const game = new Game({ ...config, parent });

    const gl = game.renderer.gl;
    const maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    console.log('Max texture size supported:', maxTexSize);

    return game;
}

export default StartGame;
