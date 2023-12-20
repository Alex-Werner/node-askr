export default function emit(commandAction, data) {
    // console.log('Emitting', commandAction, data)
    const interestedPeers = this.peers.get(commandAction) || [];

    for (let peer of interestedPeers) {
        this.emitToPeer(peer, {
            type: commandAction,
            payload: data
        });
    }
}
