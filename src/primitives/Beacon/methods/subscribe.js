export default function subscribe(socket, commandAction) {
    // console.log('Subscribing', commandAction)

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
