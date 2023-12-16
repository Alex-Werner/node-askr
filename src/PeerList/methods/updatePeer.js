export default function updatePeer(peer) {
    const peerID = peer.getID();
    if (this.peers.has(peerID)) {
        this.peers.set(peerID, peer);
    }
}
