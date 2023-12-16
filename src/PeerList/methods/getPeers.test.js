import { expect, test } from 'vitest'
import getPeers from './getPeers.js'

test('getPeers', () => {
    const peerList = {
        peers: new Map(),
        getPeer: (peerID) => {
            return peerList.peers.get(peerID) || null
        }
    }

    class Peer {
        constructor() {
            this.id = 'peerID'
        }
        getID() {
            return this.id
        }
    }
    const peer = new Peer()
    peerList.peers.set('peerID', peer)
    expect(getPeers.call(peerList, 'peerID')).toBe(peer)
    expect(getPeers.call(peerList, 'peerID2')).toBe(null)
});
