export default function send(data) {
    const logger = this.logger;
    if (!this.connected) {
        logger.error(`Cannot send message to disconnected peer ${this.id}`);
        return;
    }

    // Assuming we're sending JSON messages
    this.connection.write(JSON.stringify(data));
}
