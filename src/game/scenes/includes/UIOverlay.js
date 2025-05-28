export function addOverlay(scene) {
    const uiOverlay = scene.add.image(scene.scale.width / 2, 0, 'uiOverlay')
        .setOrigin(0.5, 0)
        .setDepth(1000);

    const scaleX = scene.scale.width / uiOverlay.width;
    uiOverlay.setScale(scaleX);

    return uiOverlay;
}