export default function getPeer(peerID) {
    return this.peers.get(peerID) || null;
}
