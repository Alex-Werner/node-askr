import Beacon from './Beacon.js';
import Peer from './Peer.js';
import PeerList from './PeerList/PeerList.js';
import Logger from 'hermodlog';

function generateRandomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
class Askr {
    constructor() {
        this.id = 'askr-'+ generateRandomString(6);
        this.logger = new Logger().context(this.id);
        this.beacon = new Beacon({
            logger: this.logger
        });
        this.peerList = new PeerList();
        this.listeners = {};
    }

    // Returns the path to the peer
    getPath() {
        return this.beacon.getPath();
    }
    async start() {
        this.beacon.start();

        // Setting up a listener for handshake messages
        this.beacon.on('handshake', (data, el, senderPeer) => {
            console.log('Adding peer', data, el, senderPeer);

            this.logger.method('start').log(`Received handshake from ${senderPeer.getID()}`);
            this._handleHandshake(data, senderPeer);
        });

        this.beacon.on('event', (data, senderPeer) => {
            console.log('event', data, senderPeer)
            const { commandAction, payload } = data;
            const callback = this.listeners[commandAction];
            if (callback) {
                callback(payload, senderPeer);
            }
        });
    }

    addPeer(host, port) {
        const peer = new Peer(host, port, this.logger);
        console.log('Adding peer', peer);
        this.logger.method('addPeer').log(`Adding peer ${peer.getID()}`);
        this.peerList.addPeer(peer);
        this.handshake(peer);
    }

    handshake(peer) {
        const networkMap = this.peerList.getNetworkMap();
        this.logger.method('handshake').log(`Sending handshake to ${peer.getID()}`);
        peer.send({
            type: 'handshake',
            payload: networkMap
        });
    }

    on(commandAction, callback) {
        this.listeners[commandAction] = callback;
        this.beacon.on(commandAction, (data, senderPeer) => {
            return callback(data, senderPeer);
        });
        this.beacon.emit('subscribe', { topic: commandAction });
    }

    emit(commandAction, data) {
        this.beacon.emit(commandAction, data);
    }

    _handleHandshake(data, senderPeer) {
        this.logger.method('_handleHandshake').log(`Received handshake from ${senderPeer.getID()}`);
        const { payload } = data;
        // Update the peer list with the received network map
        this.peerList.updateFromNetworkMap(payload);

        // Optionally: If you want to respond back with your network map
        // senderPeer.send({
        //   type: 'handshake',
        //   payload: this.peerList.getNetworkMap()
        // });
    }
}

export default Askr;
