export class Viewfinder {
    constructor(scene) {
        this.scene = scene;
        this.viewfinder = null;
    }

    addViewfinder() {
        this.viewfinder = this.scene.add.sprite(0, 0, 'viewfinder');
        this.viewfinder.setOrigin(0.5); // center the sprite
        this.viewfinder.setDepth(10);
        this.viewfinder.setVisible(false);  // hide initially if needed
    }

    update(colHighlight, rowHighlight) {
        if (this.viewfinder && colHighlight && rowHighlight) {
            this.viewfinder.setPosition(colHighlight.x, rowHighlight.y);
            this.viewfinder.setVisible(true);
        } else if (this.viewfinder) {
            this.viewfinder.setVisible(false);
        }
    }
}
