export default function  handshake(peer) {
    const networkMap = this.peerList.getNetworkMap();
    this.logger.method('handshake').log(`Sending handshake to ${peer.getID()}`);
    peer.send({
        type: 'handshake',
        payload: networkMap
    });
}
