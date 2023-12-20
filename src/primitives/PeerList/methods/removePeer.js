export default function removePeer(peer) {
    const peerID = peer.getID();
    if (this.peers.has(peerID)) {
        this.peers.delete(peerID);
    }

    // Also remove from topic interest map
    // for (const topicSet of this.topicInterests.values()) {
    //     topicSet.delete(peerID);
    // }
}
