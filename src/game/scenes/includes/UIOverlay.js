export function addOverlay(scene) {
    const uiOverlay = scene.add.image(scene.scale.width / 2, 0, 'uiOverlay')
        .setOrigin(0.5, 0)
        .setDepth(1000);

    const scaleX = scene.scale.width / uiOverlay.width;
    uiOverlay.setScale(scaleX);

    addUiElements(scene);

    return uiOverlay;
}


function addUiElements() {
    //adds a div#screen-flash
    const screenFlash = document.createElement('div');
    screenFlash.id = 'screen-flash';
    document.body.appendChild(screenFlash);

}