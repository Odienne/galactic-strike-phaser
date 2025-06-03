export class Viewfinder {
    constructor(scene, weaponSystem) {
        this.scene = scene;
        this.weaponSystem = weaponSystem;

        const grid = this.scene.grid;
        this.cellWidth = grid.cellWidth;
        this.cellHeight = grid.cellHeight;
        this.gridStartX = grid.gridStartX;
        this.gridStartY = grid.gridStartY;

        this.viewfinder = this.createViewfinderSprite();
        this.highlightRects = this.createHighlightRectangles(5); // max 5 highlights
    }

    createViewfinderSprite() {
        const sprite = this.scene.add.sprite(0, 0, 'viewfinder3');
        sprite.setOrigin(0.5);
        sprite.setDepth(100);
        sprite.setVisible(false);
        return sprite;
    }

    createHighlightRectangles(count) {
        const rects = [];
        for (let i = 0; i < count; i++) {
            const rect = this.scene.add.rectangle(0, 0, this.cellWidth, this.cellHeight, 0xff9300, 0.2);
            rect.setStrokeStyle(1.6, 0xff9300, 0.8);
            rect.setOrigin(0.5);
            rect.setDepth(90);
            rect.setVisible(false);
            rects.push(rect);
        }
        return rects;
    }

    update(colHighlight, rowHighlight) {
        const weapon = this.weaponSystem.currentWeapon;
        this.setWeaponStyle(weapon);

        const colIndex = this.getGridColumnIndex(colHighlight.x);
        const rowIndex = this.getGridRowIndex(rowHighlight.y);

        if (!this.isValidGridPosition(colIndex, rowIndex)) {
            this.hideAll();
            return;
        }

        const mainPos = this.getCellCenterPosition(colIndex, rowIndex);
        const highlightPositions = this.calculateHighlightPositions(mainPos, weapon);

        this.updateViewfinder(colHighlight.x, rowHighlight.y);
        this.updateHighlightRects(highlightPositions);
    }

    isValidGridPosition(colIndex, rowIndex) {
        return (
            typeof colIndex === 'number' &&
            typeof rowIndex === 'number' &&
            colIndex >= 0 &&
            rowIndex >= 0
        );
    }

    getCellCenterPosition(colIndex, rowIndex) {
        return {
            x: this.gridStartX + colIndex * this.cellWidth + this.cellWidth / 2,
            y: this.gridStartY + rowIndex * this.cellHeight + this.cellHeight / 2,
        };
    }

    calculateHighlightPositions(mainPos, weapon) {
        const spacingX = this.cellWidth;
        const spacingY = this.cellHeight;

        switch (weapon) {
            case 1:
                return [mainPos]; // single target center
            case 2:
                return [
                    {x: mainPos.x - spacingX, y: mainPos.y}, // left
                    mainPos,                                   // center
                    {x: mainPos.x + spacingX, y: mainPos.y}  // right
                ];
            case 3:
                return [
                    mainPos,                                   // center
                    {x: mainPos.x - spacingX, y: mainPos.y - spacingY}, // left-top
                    {x: mainPos.x + spacingX, y: mainPos.y - spacingY}, // right-top
                    {x: mainPos.x - spacingX, y: mainPos.y + spacingY}, // left-bottom
                    {x: mainPos.x + spacingX, y: mainPos.y + spacingY}  // right-bottom
                ];
            default:
                return [mainPos]; // fallback to single center
        }
    }

    hideAll() {
        this.viewfinder.setVisible(false);
        this.highlightRects.forEach(rect => rect.setVisible(false));
    }


    setWeaponStyle(weaponId) {
        switch (weaponId) {
            case 1: // red
                this.setHighlightStyle(0xff0000, 0.5, 0.2);
                this.viewfinder.setTexture('viewfinder');
                break;
            case 2: // violet
                this.setHighlightStyle(0xe66eff, 0.5, 0.2);
                this.viewfinder.setTexture('viewfinder2');
                break;
            case 3: // orange
                this.setHighlightStyle(0xff9300, 0.5, 0.2);
                this.viewfinder.setTexture('viewfinder3');
                break;
            default:
                this.setHighlightStyle(0xffffff, 0.5, 0.2);
                this.viewfinder.setTexture('viewfinder1'); // fallback sprite
        }
    }

    setHighlightStyle(strokeColor, strokeAlpha, fillAlpha) {
        this.highlightRects.forEach(rect => {
            rect.setStrokeStyle(1.6, strokeColor, strokeAlpha);
            rect.setFillStyle(strokeColor, fillAlpha);
        });
    }

    getGridColumnIndex(x) {
        return Math.floor((x - this.gridStartX) / this.cellWidth);
    }

    getGridRowIndex(y) {
        return Math.floor((y - this.gridStartY) / this.cellHeight);
    }

    updateViewfinder(x, y) {
        this.viewfinder.setPosition(x, y);
        this.viewfinder.setVisible(true);
    }

    updateHighlightRects(positions) {
        this.highlightRects.forEach((rect, i) => {
            if (positions[i]) {
                rect.setPosition(positions[i].x, positions[i].y);
                rect.setVisible(true);
            } else {
                rect.setVisible(false);
            }
        });
    }

}
