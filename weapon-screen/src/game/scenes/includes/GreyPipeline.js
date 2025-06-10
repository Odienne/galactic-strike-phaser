export default class GreyPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game,
            fragShader: document.getElementById('greyscaleShader').textContent // or load from file
        });
    }
}