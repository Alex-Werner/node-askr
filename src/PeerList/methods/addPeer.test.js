import { expect, test } from 'vitest'
import addPeer from './addPeer.js'

test('addPeer', () => {
    const peerList = {
        peers: new Map(),
        addPeer
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
    peerList.addPeer(peer)
    expect(peerList.peers.get('peerID')).toBe(peer)
})

