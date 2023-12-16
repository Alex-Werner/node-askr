import {createServer} from 'net';
import Logger from "hermodlog";
import Peer from "./Peer.js";
import getHost from './utils/getHost.js';

import addPeer from './Beacon/addPeer.js';
class Beacon {
    constructor(props = {}) {
        this.server = null;
        this.peers = new Map(); // Key: commandAction, Value: Array of connected sockets (peers) interested in the commandAction.
        this.callbacks = {}; // Callbacks for handling different message types.

        this.host = props.host ?? getHost();
        this.port = props.port ?? 8800;

        this.logger = (props.logger ?? new Logger().context('Beacon')).module(`Beacon(${this.port})`)
    }

    start() {
        const logger = this.logger.method('start');
        this.server = createServer(socket => {
            socket.on('data', async data => {
                let message;
                try {
                    message = JSON.parse(data.toString());
                } catch (err) {
                    logger.error('Error parsing incoming message:', err);
                    return;
                }

                const isCommandMessage = message && message.workspace && message.mid && message.command && message.data;
                const isSubscriptionMessage = message && message.type && message.eventType;


                if(isSubscriptionMessage) {
                    const { eventType } = message;
                    logger.log(`Received subscription message ${eventType} from ${socket.remoteAddress}:${socket.remotePort}`);

                    this.subscribe(socket, eventType);
                    return;
                }


                else if(isCommandMessage) {
                    const {workspace, mid, command, data} = message;
                    logger.log(`Received command message ${command} from ${workspace} with mid ${mid}`);

                    const callback = this.callbacks[command];
                    const response = {
                        mid: mid,
                    };
                    if (callback) {
                        console.log('Callback found', callback)
                        const value = await callback(message, socket, this);
                        console.log('Callback', value)
                        response.value = value;
                    }
                    console.log({response})
                    socket.write(JSON.stringify(response));
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
            let localLogger = self.logger.method('tryListen');
            localLogger.log(`Trying to listen on port: ${this.port}`)
            this.server
                .listen(this.port)
                .on('listening', () => {
                    localLogger
                        .log(`Listening on port: ${this.port}`)
                    localLogger
                        .listener('listening').log(`Beacon started on port ${this.getPath()}`);
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
                            localLogger.log('Handshake received', payload);
                        }
                    });
                    localLogger.listener('connection').log(`Peer ${peer.id} connected`);
                })
                .on('message', (message) => {
                    localLogger.listener('message').log(`Message ${message}` );
                })
                .on('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        localLogger.log('Address in use, retrying...', this.port)
                        this.port++;
                        localLogger.log('New port', this.port)
                        return this.server.listen(this.port);
                    } else {
                        localLogger.error('Failed to start the server:', err);
                    }
                });
        }

        tryListen();
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
        console.log('Subscribing', commandAction)

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

    getPath() {
        return `ws://${this.host}:${this.port}`;
    }
}

Beacon.prototype.addPeer = addPeer;
export default Beacon;
