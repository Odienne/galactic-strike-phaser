export class Grid {
    constructor(scene, enemyVideoManager) {
        this.scene = scene;
        this.enemyVideoManager = enemyVideoManager;
        this.cols = 10;
        this.rows = 10;
        this.gridStartX = 550;
        this.gridStartY = 32;
        this.gridWidth = 1330;
        this.gridHeight = 996;
        this.cellWidth = this.gridWidth / this.cols;
        this.cellHeight = this.gridHeight / this.rows;

        this.ships = [];
        // Track cells: 'empty', 'ship', 'hit', 'miss'
        this.cellStatus = [];
        for (let r = 0; r < this.rows; r++) {
            this.cellStatus[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.cellStatus[r][c] = 'empty';
            }
        }

        // This will store graphics overlays keyed by 'row_col' to prevent duplicates
        this.cellOverlays = {};
        this.placeShipsRandomly();
        this.initializeShips();
        this.createGrid();
        this.animateHighlights();
    }

    createGrid() {
        const graphics = this.scene.add.graphics({lineStyle: {width: 1, color: 0xffffff, alpha: 0.2}});

        for (let i = 0; i <= this.cols; i++) {
            const x = this.gridStartX + i * this.cellWidth;
            graphics.strokeLineShape(new Phaser.Geom.Line(x, this.gridStartY, x, this.gridStartY + this.gridHeight));
        }
        for (let j = 0; j <= this.rows; j++) {
            const y = this.gridStartY + j * this.cellHeight;
            graphics.strokeLineShape(new Phaser.Geom.Line(this.gridStartX, y, this.gridStartX + this.gridWidth, y));
        }
    }

    animateHighlights() {
        const scene = this.scene;

        this.createHighlights();

        this.rowTween = scene.tweens.add({
            targets: this.rowHighlight,
            y: {
                from: this.rowHighlight.y,
                to: this.gridStartY + this.gridHeight - this.cellHeight / 2
            },
            duration: 4000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.colTween = scene.tweens.add({
            targets: this.colHighlight,
            x: {
                from: this.colHighlight.x,
                to: this.gridStartX + this.gridWidth - this.cellWidth / 2
            },
            duration: 4000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Add input listeners to pause/resume tween if needed
        scene.input.keyboard.on('keydown-Q', () => {
            if (!this.qPressed) {
                this.qPressed = true;
                if (this.rowTween.isPlaying()) this.rowTween.pause();
                this.checkForViewfinderAnimation();
                this.chooseLockSound();
            }
        });

        scene.input.keyboard.on('keyup-Q', () => {
            this.qPressed = false;
            if (this.rowTween.isPaused()) this.rowTween.resume();
            this.checkForViewfinderAnimation();
        });

        scene.input.keyboard.on('keydown-D', () => {
            if (!this.dPressed) {
                this.dPressed = true;
                if (this.colTween.isPlaying()) this.colTween.pause();
                this.chooseLockSound();
                this.checkForViewfinderAnimation();
            }
        });

        scene.input.keyboard.on('keyup-D', () => {
            this.dPressed = false;
            if (this.colTween.isPaused()) this.colTween.resume();
            this.checkForViewfinderAnimation();
        });
    }

    initializeShips() {
        this.shipCells = []; // Array of all ship coordinates

        const shipSizes = [5, 3, 2, 2, 1];

        for (let size of shipSizes) {
            let placed = false;

            while (!placed) {
                const isHorizontal = Math.random() < 0.5;
                const maxCol = isHorizontal ? this.cols - size : this.cols - 1;
                const maxRow = isHorizontal ? this.rows - 1 : this.rows - size;

                const startCol = Phaser.Math.Between(0, maxCol);
                const startRow = Phaser.Math.Between(0, maxRow);

                const newShip = [];

                for (let i = 0; i < size; i++) {
                    const x = isHorizontal ? startCol + i : startCol;
                    const y = isHorizontal ? startRow : startRow + i;
                    newShip.push({col: x, row: y});
                }

                // check for collision
                const collision = newShip.some(pos =>
                    this.shipCells.some(existing =>
                        existing.col === pos.col && existing.row === pos.row
                    )
                );

                if (!collision) {
                    this.shipCells.push(...newShip);
                    placed = true;
                }
            }
        }
    }

    placeShipsRandomly() {
        const gridRows = this.rows;
        const gridCols = this.cols;

        // Define the ships by their sizes (length)
        const defaultShipsInfos = [
            {
                size: 5,
                spriteKey: 'ship5'
            },
            {
                size: 3,
                spriteKey: 'ship3'
            },
            {
                size: 2,
                spriteKey: 'ship2a'
            },
            {
                size: 2,
                spriteKey: 'ship2b'
            },
            {
                size: 1,
                spriteKey: 'ship1'
            }
        ];  // your ships, including two of length 2

        // Reset cell status grid
        this.cellStatus = Array.from({length: gridRows}, () => Array(gridCols).fill(null));

        this.ships = [];  // Reset ships array

        defaultShipsInfos.forEach((shipInfo) => {
            let placed = false;
            const size = shipInfo.size;
            const spriteKey = shipInfo.spriteKey;

            while (!placed) {
                // Random orientation: true = horizontal, false = vertical
                const horizontal = Math.random() < 0.5;

                // Calculate max start positions to fit ship inside grid
                const maxRow = horizontal ? gridRows - 1 : gridRows - size;
                const maxCol = horizontal ? gridCols - size : gridCols - 1;

                const startRow = Phaser.Math.Between(0, maxRow);
                const startCol = Phaser.Math.Between(0, maxCol);

                // Check if the cells are free
                let canPlace = true;
                for (let i = 0; i < size; i++) {
                    const r = startRow + (horizontal ? 0 : i);
                    const c = startCol + (horizontal ? i : 0);

                    if (this.cellStatus[r][c] !== null) {
                        canPlace = false;
                        break;
                    }
                }

                if (canPlace) {
                    // Place the ship and save its cells
                    const newShip = {
                        cells: [],
                        hits: 0,
                        spriteKey,
                        orientation: horizontal ? 'horizontal' : 'vertical',
                    };
                    for (let i = 0; i < size; i++) {
                        const r = startRow + (horizontal ? 0 : i);
                        const c = startCol + (horizontal ? i : 0);

                        this.cellStatus[r][c] = {type: 'ship', shipIndex: this.ships.length};
                        newShip.cells.push({r, c});
                    }

                    this.ships.push(newShip);
                    placed = true;
                }
            }
        });
    }

    fireAtCell(x, y) {
        const col = Math.floor((x - this.gridStartX) / this.cellWidth);
        const row = Math.floor((y - this.gridStartY) / this.cellHeight);

        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return false;

        // Already hit or miss?
        const cell = this.cellStatus[row][col];
        if (cell === 'hit' || cell === 'miss') return false;

        const key = `${row}_${col}`;
        if (this.cellOverlays[key]) return false; // overlay exists

        let hit = false;

        if (cell && cell.type === 'ship') {
            hit = true;
            this.cellStatus[row][col] = 'hit';

            // Register hit on ship
            const ship = this.ships[cell.shipIndex];
            ship.hits++;

            // Increase score by 10 points for every hit
            this.scene.score.add(10);

            // Check if ship is fully hit (sunk)
            if (ship.hits === ship.cells.length) {
                this.revealShip(ship);
                if (!this.areAllShipsSunk()) { //another video will be played for that
                    this.enemyVideoManager.playRandomEnemyFuriousVideo();
                }
            }
        } else {
            this.cellStatus[row][col] = 'miss';
        }

        // Draw overlay
        const centerX = this.gridStartX + col * this.cellWidth + this.cellWidth / 2;
        const centerY = this.gridStartY + row * this.cellHeight + this.cellHeight / 2;
        const color = hit ? 0xff0000 : 0xffffff;
        const opacity = hit ? 0.6 : 0.4;

        this.cellOverlays[key] = this.scene.add.rectangle(centerX, centerY, this.cellWidth, this.cellHeight, color, opacity).setOrigin(0.5);

        // After revealing and updating hits:
        if (this.areAllShipsSunk()) {
            this.enemyVideoManager.playRandomSurrenderVideo(() => {
                this.pixelatedGridAnimation(() => {
                    this.resetShips();
                });
            });
        }

        return hit;
    }

    revealShip(ship) {
        this.addDebris(ship);

        // Determine orientation
        let horizontal = true;
        if (ship.cells.length > 1) {
            horizontal = ship.cells[0].r === ship.cells[1].r;
        }

        // Compute bounding box
        const rows = ship.cells.map(cell => cell.r);
        const cols = ship.cells.map(cell => cell.c);
        const minRow = Math.min(...rows);
        const maxRow = Math.max(...rows);
        const minCol = Math.min(...cols);
        const maxCol = Math.max(...cols);

        // Calculate position and size
        const x = this.gridStartX + (minCol * this.cellWidth) + ((maxCol - minCol + 1) * this.cellWidth) / 2;
        const y = this.gridStartY + (minRow * this.cellHeight) + ((maxRow - minRow + 1) * this.cellHeight) / 2;
        const width = (maxCol - minCol + 1) * this.cellWidth;
        const height = (maxRow - minRow + 1) * this.cellHeight;

        // Choose sprite key
        let spriteKey = ship.spriteKey || `ship${ship.cells.length}`;
        const sprite = this.scene.add.sprite(x, y, spriteKey).setOrigin(0.5);

        // Rotate if vertical
        if (!horizontal) {
            sprite.angle = 90;
            sprite.setScale(0.9);
        } else {
        }

        sprite.setDepth(1);
        sprite.setAlpha(0.7);
        ship.sprite = sprite;
    }


    randomOrientation() {
        return Math.random() < 0.5 ? 'horizontal' : 'vertical';
    }

    areAllShipsSunk() {
        return this.ships.every(ship => ship.hits >= ship.cells.length);
    }

    resetShips() {
        // Clear cell statuses and overlays
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.cellStatus[r][c] = {type: 'empty'};
                const key = `${r}_${c}`;
                if (this.cellOverlays && this.cellOverlays[key]) {
                    this.cellOverlays[key].destroy();
                    delete this.cellOverlays[key];
                }
            }
        }

        // Clear previous ship sprites
        this.ships.forEach(ship => {
            if (ship.sprite) {
                ship.sprite.destroy();
            }
        });

        // Place new ships randomly
        this.placeShipsRandomly();
    }


    pixelatedGridAnimation(onComplete = null) {
        // Add pixelation post-processing effect to the video
        const fxPixelated = this.scene.bgVideo.postFX.addPixelate(-1);
        this.scene.bgVideo.setDepth(500);

// Animate the pixel amount to simulate a ripple/glitch effect
        this.scene.tweens.addCounter({
            from: -1,
            to: 30,
            duration: 800,
            yoyo: true,
            onUpdate: (tween) => {
                fxPixelated.amount = tween.getValue();
            },
            onComplete: () => {
                // Optional: clear the effect after animation
                this.scene.bgVideo.postFX.clear();
                this.scene.bgVideo.setDepth(-11);
                if (onComplete) {
                    onComplete();
                }
            }
        });
    }

    createHighlights() {
        this.createRowHighlight();
        this.createColumnHighlight();
    }

    createRowHighlight() {
        // Create a horizontal gradient texture for the row highlight
        const rowWidth = 1400;
        const rowHeight = this.cellHeight;

        const rowGradientTexture = this.scene.textures.createCanvas('rowGradient', rowWidth, rowHeight);
        const ctxRow = rowGradientTexture.getContext();

        // Create linear gradient from left (blue opaque) to right (transparent)
        const gradientRow = ctxRow.createLinearGradient(0, 0, 0, rowHeight);
        gradientRow.addColorStop(0, 'rgba(255, 255, 255,0)');
        gradientRow.addColorStop(0.5, 'rgba(255, 255, 255,0.4)');
        gradientRow.addColorStop(1, 'rgba(255, 255, 255,0)');

        ctxRow.fillStyle = gradientRow;
        ctxRow.fillRect(0, 0, rowWidth, rowHeight);

        rowGradientTexture.refresh();

        this.rowHighlight = this.scene.add.image(this.gridStartX + rowWidth / 2, this.gridStartY + rowHeight / 2, 'rowGradient');
        this.rowHighlight.setOrigin(0.5);
        this.rowHighlight.setDepth(5);
    }

    createColumnHighlight() {

// Similarly for column highlight (vertical gradient)
        const colWidth = this.cellWidth;
        const colHeight = 1080;

        const colGradientTexture = this.scene.textures.createCanvas('colGradient', colWidth, colHeight);
        const ctxCol = colGradientTexture.getContext();

        const gradientCol = ctxCol.createLinearGradient(0, 0, colWidth, 0);
        gradientCol.addColorStop(0, 'rgba(255, 255, 255,0)');
        gradientCol.addColorStop(0.5, 'rgba(255, 255, 255,0.4)');
        gradientCol.addColorStop(1, 'rgba(255, 255, 255,0)');

        ctxCol.fillStyle = gradientCol;
        ctxCol.fillRect(0, 0, colWidth, colHeight);

        colGradientTexture.refresh();

        this.colHighlight = this.scene.add.image(this.gridStartX + colWidth / 2, this.gridStartY + colHeight / 2, 'colGradient');
        this.colHighlight.setOrigin(0.5);
        this.colHighlight.setDepth(5);
    }

    addDebris(ship) {
        ship.cells.forEach(({r, c}) => {
            const key = `${r}_${c}`;

            // Center of the cell
            const x = this.gridStartX + c * this.cellWidth + this.cellWidth / 2;
            const y = this.gridStartY + r * this.cellHeight + this.cellHeight / 2;

            // Stone debris emitter
            const stonesEmitter = this.scene.add.particles(x, y, 'explosion', {
                frame: 'stone',
                angle: {min: 240, max: 300},
                speed: {min: 400, max: 800},
                lifespan: 3200,
                alpha: {start: 1, end: 0},
                scale: {min: 0.05, max: 0.4},
                rotate: {start: 0, end: 360, ease: 'Back.easeOut'},
                gravityY: 800,
                on: true
            });

            // Emit all at once at coordinates (x, y)
            stonesEmitter.explode(3);
        });
    }

    checkForViewfinderAnimation() {
        if (this.qPressed && this.dPressed) {
            if (this.scene.viewfinder) {
                this.scene.viewfinder.lockViewfinderAnimation();
                this.scene.viewfinder.setAccentColorRectangles();
            }
        } else {
            if (this.scene.viewfinder) {
                this.scene.viewfinder.unlockViewfinderAnimation();
                this.scene.viewfinder.resetAccentColorRectangles();
            }
        }
    }

    chooseLockSound() {
        if (this.qPressed && this.dPressed) {
            return this.scene.soundSystem.playDoubleLock();
        }
        return this.scene.soundSystem.playLock();
    }
}
