import { expect, test } from 'vitest'
import getPeer from './getPeer.js'

test('getPeer', () => {
    const peerList = {
        peers: new Map(),
        getPeer
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
    expect(peerList.getPeer('peerID')).toBe(peer)
    expect(peerList.getPeer('peerID2')).toBe(null)
});
