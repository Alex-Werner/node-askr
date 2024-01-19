/**
 * Client to the contrary of Askr is only use to connect and pass along messages or commands
 */
import Logger from "hermodlog";
import {createConnection} from 'net';
import CommandMessage from "../CommandMessage/CommandMessage.js";
import SubscriptionMessage from "../SubscriptionMessage/SubscriptionMessage.js";

// Create a connection to the peer
async function createConnectionToPeer(host, port, logger) {
    // console.log('createConnectionToPeer', {host}, {port});
    const connection = {
        host,
        port,
        connected: false,
        id: `${host}:${port}`,
        connection: null,
    };

    connection.logger = logger ?? new Logger().module(`Peer(${connection.id})`);

    return new Promise((resolve, reject) => {
        if (connection.connected) return;

        connection.connection = createConnection(connection.port, connection.host);
        connection.connection.on('connect', () => {
            connection.connected = true;
            connection.logger.log(`Connected to peer ${connection.id}`);
            resolve(connection);
        });
        connection.connection.on('close', () => {
            connection.connected = false;
        });
        connection.connection.on('error', (error) => {
            connection.logger.error(`Error in connection with peer ${connection.id}: `, error);
            connection.connected = false;
            reject(error);
        });
    });
}

class Client {
    constructor({workspace, logger, port, host}) {
        this.workspace = workspace ?? 'askr';
        this.logger = logger ?? new Logger().context('Client');
        this.port = port ?? 8800;
        this.host = host ?? 'localhost';
    }

    async connect() {
        const logger = this?.logger?.method ? this?.logger?.method('connect') : this.logger;
        logger.method('connect').log('Client.connect()');

        this.connection = await createConnectionToPeer(this.host, this.port, logger);

    }

    async on(eventType, callback) {
        const logger = this?.logger?.method ? this?.logger?.method('on') : this.logger;
        logger.method('on').log(`Client.on(${eventType})`);

        // Send a subscription message to the peer
        const subscriptionMessage = new SubscriptionMessage(eventType);
        const request = subscriptionMessage.toJSON();
        const stringifiedSubscriptionMessage = JSON.stringify(request);
        logger.method('on').log('Client.on() stringifiedCommandMessage', stringifiedSubscriptionMessage);
        this.connection.connection.write(stringifiedSubscriptionMessage);

        // Listen for incoming messages
        this.connection.connection.on('data', (data) => {
            const response = JSON.parse(data.toString());
            logger.method('on').log('Client.on() response', response);
            callback(response);
        });
    }

    async send(command, payload = {}) {
        const logger = this?.logger?.method ? this?.logger?.method('send') : this.logger;
        logger.method('send').log('Client.send()');

        const commandMessage = new CommandMessage(command, payload);
        const request = commandMessage.toJSON({workspace: this.workspace});
        const stringifiedCommandMessage = JSON.stringify(request);
        logger.method('send').log('Client.send() stringifiedCommandMessage', stringifiedCommandMessage);
        if(!this.connection?.connection) throw new Error('No connection');
        this.connection.connection.write(stringifiedCommandMessage);

        const response = await new Promise((resolve, reject) => {
            this.connection.connection.on('data', (data) => {
                const response = JSON.parse(data.toString());
                logger.method('send').log('Client.send() response', response);
                resolve(response);
            });
        });

        return {request, response};
    }
}

export default Client;
