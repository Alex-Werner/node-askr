export default function on(commandAction, callback) {
    this.listeners[commandAction] = callback;
    this.beacon.on(commandAction, (data, senderPeer) => {
        return callback(data, senderPeer);
    });
    this.beacon.emit('subscribe', { topic: commandAction });
}
