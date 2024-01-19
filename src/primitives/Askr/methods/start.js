export default async function start() {
    this.beacon.start();

    // Setting up a listener for handshake messages
    this.beacon.on('handshake', (data, el, senderPeer) => {
        // console.log('Adding peer', data, el, senderPeer);

        this.logger.method('start').log(`Received handshake from ${senderPeer.getID()}`);
        this._handleHandshake(data, senderPeer);
    });

    function validateSignedRequest(signature){
        // Verify the signature
        // const { publicKey, signature, data: stateRequestData } = data;
        // const verified = this.keys.verify(stateRequestData, signature, publicKey);
        // if(!verified){
        //     this.logger.method('start').log(`Received STATE_REQUEST with invalid signature from ${senderPeer.getID()}`);
        //     return;
        // }
        return true;
    }

    this.beacon.on('STATE_REQUEST', (command, senderPeer) => {
        if(command.data.signature){
           if(!validateSignedRequest(command.data.signature)){
               return {error: 'Invalid signature'};
           }
            const stateMap = this.connectedState.getState();
            const state = Object.fromEntries(stateMap)
            return state;
        }
    });


    // Verify signature
    this.beacon.on('STATE_SET', (command, senderPeer) => {
        const { key, value } = command.data;
        this.connectedState.set(key, value);
        return true;
    });

    this.beacon.on('event', (data, senderPeer) => {
        const { commandAction, payload } = data;
        const callback = this.listeners[commandAction];
        if (callback) {
            callback(payload, senderPeer);
        }
    });
}
