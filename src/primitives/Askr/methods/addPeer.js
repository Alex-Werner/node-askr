import Peer from "../../Peer/Peer.js";

export default function addPeer(host, port) {
    const peer = new Peer(host, port, this.logger);
    // console.log('Adding peer', peer);
    this.logger.method('addPeer').log(`Adding peer ${peer.getID()}`);
    this.peerList.addPeer(peer);
    this.handshake(peer);
}
