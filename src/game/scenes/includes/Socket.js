export default class Socket {
    constructor(scene) {
        this.scene = scene;
        this.socket = new WebSocket('ws://localhost:3000');

        this.clientId = "Game Screen"
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


    async onMessage(data) {
        console.log(data);

        const msg = JSON.parse(data);
        if (msg.type === 'response' && msg.requestId) {
            const resolver = this.pendingRequests[msg.requestId];
            if (resolver) {
                resolver(msg.payload.result);
                delete this.pendingRequests[msg.requestId];
            }
        }

        if (msg.type === 'request' && msg.payload?.func) {
            let result = null;

            switch (msg.payload.func) {
                case 'setWeapon':
                    result = await this.scene.weaponSystem.setWeapon(msg.payload.weaponId);
                    break;
            }

            // Send the result back
            this.socket.send(JSON.stringify({
                type: 'response',
                from: this.clientId,
                to: msg.from,
                payload: {result},
                requestId: msg.requestId
            }));
        }


    }

    isWeaponOffCoolDown() {
        return new Promise((resolve) => {
            const requestId = crypto.randomUUID();

            // Store a resolver to match the future response
            this.pendingRequests[requestId] = resolve;

            this.socket.send(JSON.stringify({
                type: 'request',
                from: this.clientId,
                to: 'Weapon Screen',
                payload: {func: 'isWeaponOffCoolDown'},
                requestId
            }));
        });
    }

    updateWeaponCooldown() {
        const requestId = crypto.randomUUID();

        this.socket.send(JSON.stringify({
            type: 'request',
            from: this.clientId,
            to: 'Weapon Screen',
            payload: {func: 'updateWeaponCooldown'},
            requestId
        }));
    }
}