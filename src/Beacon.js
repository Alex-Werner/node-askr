import {createServer} from 'net';
import os from 'os';
import Logger from "hermodlog";
import {Peer} from "./Peer.js";

function getHost() {
    const networkInterfaces = os.networkInterfaces();

    for (let ifaceName in networkInterfaces) {
        const iface = networkInterfaces[ifaceName];
        for (let alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1'; // default to localhost if no external IP found
}

class Beacon {
    constructor(props = {}) {
        this.logger = props.logger ?? new Logger().context('Beacon');
        this.server = null;
        this.peers = new Map(); // Key: commandAction, Value: Array of connected sockets (peers) interested in the commandAction.
        this.callbacks = {}; // Callbacks for handling different message types.

        this.host = props.host ?? getHost();
        this.port = props.port ?? 8800;
    }

    start() {
        const logger = this.logger.method('start');
        this.server = createServer(socket => {
            socket.on('data', data => {
                let message;
                try {
                    message = JSON.parse(data.toString());
                } catch (err) {
                    logger.error('Error parsing incoming message:', err);
                    return;
                }

                const callback = this.callbacks[message.type];
                if (callback) {
                    callback(message.payload, socket, this);
                }
            });
        });

        const self = this;
        const tryListen = () => {
            self.logger.log('Trying to listen on port', this.port)
            this.server
                .listen(this.port)
                .on('listening', () => {
                    self.logger.log('Listening on port', this.port)
                    self.logger
                        .module(`Beacon(${this.port})`)
                        .method('tryListen')
                        .listener('listening'
                        ).log(`Beacon started on port ${this.port}`);
                })
                .on('close', () => {
                    self.logger.module(`Beacon(${this.port})`).method('tryListen').listener('close').log(`Beacon close on port ${this.port}`);
                })
                .on('connection', (socket) => {
                    const peerhost = socket.remoteAddress;
                    const peerport = socket.remotePort;
                    const peer = new Peer(peerhost, peerport);
                    peer.connect(socket);
                    peer.connection.on('data', data => {
                        const parsedData = JSON.parse(data.toString());
                        const {type, payload} = parsedData;
                        if (type === 'handshake') {
                            self.logger.log('Handshake received', payload);
                        }
                    });
                    self.logger.module(`Beacon(${this.port})`).method('tryListen').listener('connection').log(`Peer ${peer.id} connected`);
                })
                .on('message', (message) => {
                    self.logger.module(`Beacon(${this.port})`).method('tryListen').listener('message').log(`Message ${message}` );
                })
                .on('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        self.logger.log('Address in use, retrying...', this.port)
                        this.port++;
                        self.logger.log('New port', this.port)
                        return this.server.listen(this.port);
                    } else {
                        self.logger.error('Failed to start the server:', err);
                    }
                });
        }

        tryListen();
    }

    addPeer(host, port) {
        const peer = new Peer(host, port);
        peer.connect();
        this.subscribe(peer.connection, 'handshake');
    }

    on(type, callback) {
        this.logger.method('.on').log('Setting callback for type ', type)
        this.callbacks[type] = callback;
    }

    emit(commandAction, data) {
        console.log('Emitting', commandAction, data)
        const interestedPeers = this.peers.get(commandAction) || [];

        for (let peer of interestedPeers) {
            this.emitToPeer(peer, {
                type: commandAction,
                payload: data
            });
        }
    }

    subscribe(socket, commandAction) {
        const currentPeers = this.peers.get(commandAction) || [];
        if (!currentPeers.includes(socket)) {
            currentPeers.push(socket);
            this.peers.set(commandAction, currentPeers);
        }

        socket.on('close', () => {
            // Remove socket from list when disconnected.
            const updatedPeers = (this.peers.get(commandAction) || []).filter(peer => peer !== socket);
            this.peers.set(commandAction, updatedPeers);
        });
    }

    emitToPeer(peer, message) {
        try {
            peer.write(JSON.stringify(message));
        } catch (err) {
            console.error('Error sending message to peer:', err);
        }
    }
}

export {Beacon};
