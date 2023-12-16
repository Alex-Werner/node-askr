function getNetworkMap() {
    let networkMap = [];
    for (const peer of this.peers.values()) {
        networkMap.push({ id: peer.getID(), host: peer.getHost(), port: peer.getPort() });
    }
    return networkMap;
}
export default getNetworkMap;
1
