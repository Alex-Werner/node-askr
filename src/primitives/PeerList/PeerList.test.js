import { expect, test } from 'vitest'
import PeerList from './PeerList.js'

let peerList;
let alicePeer;
let updatedAlicePeer;
let bobPeer;
class Peer {
    constructor(host, port, id = 'peerID') {
        this.id = id
        this.host = host
        this.port = port
    }
    getID() {
        return this.id
    }
    getHost() {
        return this.host
    }
    getPort() {
        return this.port
    }
}
test('PeerList', () => {
    peerList = new PeerList()
    expect(peerList.peers).toBeInstanceOf(Map)
    expect(peerList.topicInterests).toBeInstanceOf(Map)
    expect(peerList.getPeer('peerID')).toBe(null)
    expect(peerList.getNetworkMap()).toEqual([])
})

test('PeerList.addPeer', () => {
    alicePeer = new Peer('localhost', 8000, 'askr-alice');
    peerList.addPeer(alicePeer)
    expect(peerList.peers.get('askr-alice')).toBe(alicePeer)
})

test('PeerList.getPeer', () => {
    expect(peerList.getPeer('askr-alice')).toBe(alicePeer)
    expect(peerList.getPeer('peerID2')).toBe(null)
});

test('PeerList.getPeers', () => {
    const expectedPeers = [
        alicePeer
    ]
    expect(peerList.getPeers()).toEqual(expectedPeers)
})

test('PeerList.updatePeer', () => {
    updatedAlicePeer = new Peer('192.168.1.0', 8000, 'askr-alice');
    peerList.updatePeer(updatedAlicePeer)
    console.log(peerList.peers.get('askr-alice'))
    expect(peerList.peers.get('askr-alice')).toBe(updatedAlicePeer)
});

test('PeerList.removePeer', () => {
   peerList.removePeer(alicePeer)
    expect(peerList.getPeer('askr-alice')).toBe(null)
});
