import Peer from "../../Peer.js";

export default function addPeer(peer) {
    const peerType = peer.constructor.name
    if (!(peerType === 'Peer' || peerType === 'PeerMock')) {
        throw new Error(`Invalid peer object: ${peerType} - ${JSON.stringify(peer)}`);
    }

    const peerID = peer.getID();

    // Check if peer already exists
    if (!this.peers.has(peerID)) {
        this.peers.set(peerID, peer);
    }
}

