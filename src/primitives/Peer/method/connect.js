import { createConnection } from 'net';

export default async function connect(socket) {
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
