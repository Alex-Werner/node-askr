export default async function start() {
    this.beacon.start();

    // Setting up a listener for handshake messages
    this.beacon.on('handshake', (data, el, senderPeer) => {
        // console.log('Adding peer', data, el, senderPeer);

        this.logger.method('start').log(`Received handshake from ${senderPeer.getID()}`);
        this._handleHandshake(data, senderPeer);
    });

    this.beacon.on('event', (data, senderPeer) => {
        // console.log('event', data, senderPeer)
        const { commandAction, payload } = data;
        const callback = this.listeners[commandAction];
        if (callback) {
            callback(payload, senderPeer);
        }
    });
}
