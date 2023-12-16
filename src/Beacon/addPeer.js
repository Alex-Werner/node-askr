import Peer from "../Peer.js";

export default function addPeer(host, port) {
    const peer = new Peer(host, port);
    peer.connect();
    this.subscribe(peer.connection, 'handshake');
}
