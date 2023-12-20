import Peer from "../../Peer/Peer.js";

export default async function addPeer(host, port) {
    const peer = new Peer(host, port);
    await peer.connect();
    await this.subscribe(peer.connection, 'handshake');
    return peer;
}
