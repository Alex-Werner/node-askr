// Peer.js

import { createConnection } from 'net';
import Logger from "hermodlog";

export default class Peer {
    constructor(host, port, logger) {
        this.host = host;
        this.port = port;
        this.connected = false;

        // Might require a better way to identify peers
        this.id = `${host}:${port}`;

        // The underlying socket connection to this peer
        this.connection = null;


        const contextLogger = (logger ?? new Logger()).module(`Peer(${this.id})`);
        this.logger = contextLogger;
    }

    // Connect to the peer if not already connected
    async connect(socket) {
        const logger = this.logger.method('connect');
        return new Promise((resolve, reject) => {
            if (this.connected) return;

            this.connection = socket ?? createConnection(this.port, this.host);
            this.connection.on('connect', () => {
                this.connected = true;
                logger.log(`Connected to peer ${this.id}`);
                resolve();
            });
            this.connection.on('close', () => {
                this.connected = false;
            });
            this.connection.on('error', (error) => {
                logger.error(`Error in connection with peer ${this.id}: `, error);
                this.connected = false;
                reject(error);
            });
        });

    }

    // Send a message to the peer
    send(data) {
        if (!this.connected) {
            logger.error(`Cannot send message to disconnected peer ${this.id}`);
            return;
        }

        // Assuming we're sending JSON messages
        this.connection.write(JSON.stringify(data));
    }

    // Close the connection with this peer
    close() {
        if (this.connected) {
            this.connection.end();
            this.connected = false;
        }
    }

    // Getters for properties
    getID() {
        return this.id;
    }

    getHost() {
        return this.host;
    }

    getPort() {
        return this.port;
    }
}

