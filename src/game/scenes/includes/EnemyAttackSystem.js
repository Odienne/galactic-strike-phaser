export default class EnemyAttackSystem {
    constructor(scoreModule, systemVideoManager) {
        this.scoreModule = scoreModule;
        this.systemVideoManager = systemVideoManager;

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

        this.attackScheduled = false;
        this.scheduleNextAttack();
    }

    nextRandomAttackTimer() {
        let min = 9000;
        let max = 19000;
        return Math.random() * (max - min) + min;
    }

    async scheduleNextAttack() {
        console.log('sheduling next attack')
        console.log(this.attackScheduled)
        if (this.attackScheduled) {
            console.warn('Attack already scheduled, skipping');
            return;
        }

        this.attackScheduled = true;

        if (this.attackTimeoutId) {
            clearTimeout(this.attackTimeoutId);
            this.attackTimeoutId = null;
        }

        await this.systemVideoManager.changeVideo('computerIdle');
        console.log('video changed to idle')

        this.attackTimeoutId = setTimeout(() => {
            this.attackScheduled = false;
            this.triggerAttack();
        }, this.nextRandomAttackTimer());
    }

    async triggerAttack() {
        await this.systemVideoManager.changeVideo('computerDanger');
        console.log('loaded danger, start red lights')

        this.canDefend = true;
        this.currentAttackSide = Math.random() < 0.5 ? 'left' : 'right';

        this.attackBox = document.createElement('div');
        this.attackBox.classList.add('attack-box', this.currentAttackSide);
        this.overlay.appendChild(this.attackBox);

        this.defendTimeoutId = setTimeout(() => {
            this.resolveAttack(false);
            this.attackScheduled = false; // Just in case
        }, 3000);
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

    async resolveAttack(defended) {
        console.log('resolving')
        if (!this.attackBox || !this.canDefend) return; // Prevent double call
        this.canDefend = false;

        if (this.defendTimeoutId) {
            clearTimeout(this.defendTimeoutId);
            this.defendTimeoutId = null;
        }

        if (!this.attackBox) return;

        if (defended) {
            this.attackBox.classList.add('defended');
            this.scoreModule.add(10);
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
