export default function close() {
    if (this.connected) {
        this.connection.end();
        this.connected = false;
    }
}
