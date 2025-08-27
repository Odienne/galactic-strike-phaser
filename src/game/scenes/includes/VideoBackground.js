export function addVideoBackground(scene, gridStartX, gridStartY, gridWidth, gridHeight) {
    // Add fallback image first
    const fallbackImage = scene.add.image(gridStartX, gridStartY, 'bgFallback')
        .setOrigin(0, 0)
        .setDepth(-11); // Behind video

    const video = scene.add.video(0, 0, 'bgVideo').setDepth(-10).setOrigin(0, 0);

    const nativeVideo = video.video;

    // Attempt to play video
    nativeVideo.addEventListener('error', () => {
        console.warn('Video failed to load, using fallback image.');
    });

    // Try to play video (catch silently if autoplay fails)
    try {
        video.play(true);
        video.once('play', resizeVideo);
    } catch (e) {
        console.warn('Autoplay failed:', e);
    }

    function resizeVideo() {
        fallbackImage.setVisible(false);
        
        const videoWidth = nativeVideo.videoWidth;
        const videoHeight = nativeVideo.videoHeight;

        const scaleX = gridWidth / videoWidth;
        const scaleY = gridHeight / videoHeight;
        const scale = Math.max(scaleX, scaleY);

        video.setScale(scale);
        video.setPosition(gridStartX, gridStartY);
        video.stop();
    }

    return video;
}
