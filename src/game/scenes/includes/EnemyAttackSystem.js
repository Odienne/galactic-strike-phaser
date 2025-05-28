export default class EnemyAttackSystem {
    constructor(scoreModule, gridConfig) {
        this.scoreModule = scoreModule;

        // Create overlay div
        this.overlay = document.createElement('div');
        this.overlay.id = 'enemy-attack-overlay';
        document.body.appendChild(this.overlay);

        this.attackBox = null;
        this.currentAttackSide = null;
        this.attackTimeoutId = null;
        this.defendTimeoutId = null;
        this.canDefend = false;

        // Bind methods to this
        this.handleKeyDown = this.handleKeyDown.bind(this);

        window.addEventListener('keydown', this.handleKeyDown);

        this.scheduleNextAttack();
    }

    nextRandomAttackTimer() {
        let min = 6000;
        let max = 16000;
        return Math.random() * (max - min) + min;
    }

    scheduleNextAttack() {
        this.attackTimeoutId = setTimeout(() => {
            this.triggerAttack();
        }, this.nextRandomAttackTimer());
    }

    triggerAttack() {
        this.canDefend = true;
        this.currentAttackSide = Math.random() < 0.5 ? 'left' : 'right';

        this.attackBox = document.createElement('div');
        this.attackBox.classList.add('attack-box');
        this.attackBox.classList.add(this.currentAttackSide);

        this.overlay.appendChild(this.attackBox);

        this.defendTimeoutId = setTimeout(() => {
            this.resolveAttack(false);
        }, 3000); // 3 seconds to defend
    }

    handleKeyDown(event) {
        if (!this.canDefend || !this.currentAttackSide) return;

        const key = event.key.toLowerCase();

        // 'k' for left defense, 'l' for right defense
        if ((key === 'k' && this.currentAttackSide === 'left') ||
            (key === 'l' && this.currentAttackSide === 'right')) {
            this.resolveAttack(true);
        }
    }

    resolveAttack(defended) {
        this.canDefend = false;

        if (this.defendTimeoutId) {
            clearTimeout(this.defendTimeoutId);
            this.defendTimeoutId = null;
        }

        if (!this.attackBox) return;

        if (defended) {
            this.attackBox.classList.add('defended');
            setTimeout(() => {
                this.attackBox.style.opacity = '0';
            }, 200)
            setTimeout(() => this.clearAttackBox(), 1000);
        } else {
            this.triggerScreenShake();
            this.scoreModule.add(-10);
            setTimeout(() => {
                this.attackBox.style.opacity = '0';
            }, 200)
            setTimeout(() => this.clearAttackBox(), 1000);
        }

        this.scheduleNextAttack();
    }

    clearAttackBox() {
        console.log(this.attackBox)
        if (this.attackBox && this.overlay.contains(this.attackBox)) {
            this.overlay.removeChild(this.attackBox);
            this.attackBox = null;
            this.currentAttackSide = null;
        }
    }

    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        if (this.attackTimeoutId) clearTimeout(this.attackTimeoutId);
        if (this.defendTimeoutId) clearTimeout(this.defendTimeoutId);
        this.clearAttackBox();
        if (this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    }

    triggerScreenShake() {
        const container = document.getElementById('app'); // Or #game-container
        const flash = document.getElementById('screen-flash');

        container.classList.add('shake');
        flash.classList.add('flash');

        setTimeout(() => container.classList.remove('shake'), 1300);
        setTimeout(() => flash.classList.remove('flash'), 1300);
    }
}
