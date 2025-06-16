export default class Socket {
    constructor() {
        this.socket = new WebSocket('ws://localhost:3000');
        this.clientId = "Weapon Screen"
        this.pendingRequests = [];

        this.socket.onopen = (data) => this.onOpen(data);
        this.socket.onclose = (data) => this.onClose(data);
        this.socket.onmessage = (event) => this.onMessage(event.data);
    }

    onOpen() {
        console.log("Connection ok")
        this.socket.send(JSON.stringify({
            type: 'register',
            from: this.clientId
        }));
    }

    onClose() {
        console.log("Connection lost")
    }


    onMessage = async (data) => {
        const msg = JSON.parse(data);

        if (msg.type === 'request' && msg.payload?.func) {
            console.log('request')
            console.log(msg.payload.func)
            let result = null;

            switch (msg.payload.func) {
                case 'isWeaponOffCoolDown':
                    result = await this.isWeaponOffCoolDown();
                    break;
                case 'updateWeaponCooldown':
                    result = await this.updateWeaponCooldown();
                    break;
                case 'transitionToGameOver':
                    result = await this.transitionToGameOver();
                    break;
            }

            // Send the result back
            this.socket.send(JSON.stringify({
                type: 'response',
                from: this.clientId,
                to: msg.from,
                payload: { result },
                requestId: msg.requestId
            }));
        }
    };

    isWeaponOffCoolDown = () => {
        const weaponsData = window.getWeaponInfos();
        console.log(weaponsData[window.currentWeapon].cooldown <= 0)
        return weaponsData[window.currentWeapon].cooldown <= 0;
    }

    updateWeaponCooldown = () => {
        console.log('updating cooldown');
        window.updateWeaponCooldown(window.currentWeapon);
    }

    setWeapon(weaponId) {
        window.setWeapon(weaponId);

        const requestId = crypto.randomUUID();

        this.socket.send(JSON.stringify({
            type: 'request',
            from: this.clientId,
            to: 'Game Screen',
            payload: {func: 'setWeapon', weaponId},
            requestId
        }));
    }

    transitionToGameOver() {
        window.transitionToGameOver();
    }
}