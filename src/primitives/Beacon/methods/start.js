import Peer from "../../Peer/Peer.js";
import {createServer} from 'net';


export default function start() {
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

                await this.subscribe(socket, eventType);
                return;
            }


            else if(isCommandMessage) {
                const {workspace, mid, command, data} = message;
                logger.log(`Received command message ${command} from ${workspace} with mid ${mid}`);

                const callback = this.callbacks[command];
                const response = {
                    mid: mid,
                };
                if(!callback){
                    response.error = `Command's callback for ${command} not found`;
                    socket.write(JSON.stringify(response));
                    return;
                }
                if (callback) {
                    // console.log('Callback found', callback)
                    const value = await callback(message, socket, this);
                    // console.log('Callback', value)
                    response.value = value;
                }
                socket.write(JSON.stringify(response));
                return;
            }

            const callback = this.callbacks[message.type];
            if (callback) {
                callback(message.payload, socket, this);
            }
        });
        socket.on('close', () => {
            logger.log(`Socket closed ${socket.remoteAddress}:${socket.remotePort}`);
        });
        socket.on('error', (err) => {
            logger.error(`Socket error ${socket.remoteAddress}:${socket.remotePort}`, err);
        });
        socket.on('end', () => {
            logger.log(`Socket ended ${socket.remoteAddress}:${socket.remotePort}`);
        });
        socket.on('open', () => {
            logger.log(`Socket opened ${socket.remoteAddress}:${socket.remotePort}`);
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
                let connectPromise = peer.connect(socket);
                peer.connection.on('data', data => {
                    try {
                        const parsedData = JSON.parse(data.toString());
                        const {type, payload} = parsedData;
                        if (type === 'handshake') {
                            localLogger.log('Handshake received', payload);
                        }
                    } catch (err) {
                        localLogger.error('Error parsing incoming message:', err);
                        return;
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
            })
            .on('timeout', () => {
                localLogger.log('Server timeout');
            });
    }

    tryListen();
}
