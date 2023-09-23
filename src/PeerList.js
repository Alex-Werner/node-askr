// PeerList.js
import { Peer } from './Peer.js';

export class PeerList {
    constructor() {
        // Contains all connected peers
        this.peers = new Map(); // Map of peerID to Peer object

        // Contains the mapping of topic interests to peers
        this.topicInterests = new Map(); // Map of topic to Set of peerIDs
    }

    addPeer(peer) {
        if (!(peer instanceof Peer)) {
            throw new Error('Invalid peer object');
        }

        const peerID = peer.getID();

        // Check if peer already exists
        if (!this.peers.has(peerID)) {
            this.peers.set(peerID, peer);
        }
    }

    removePeer(peerID) {
        if (this.peers.has(peerID)) {
            this.peers.delete(peerID);
        }

        // Also remove from topic interest map
        for (const topicSet of this.topicInterests.values()) {
            topicSet.delete(peerID);
        }
    }

    getAllPeers() {
        return Array.from(this.peers.values());
    }

    getPeer(peerID) {
        return this.peers.get(peerID) || null;
    }

    registerInterest(topic, peerID) {
        if (!this.topicInterests.has(topic)) {
            this.topicInterests.set(topic, new Set());
        }
        this.topicInterests.get(topic).add(peerID);
    }

    getPeersByInterest(topic) {
        if (this.topicInterests.has(topic)) {
            return Array.from(this.topicInterests.get(topic)).map(peerID => this.getPeer(peerID));
        }
        return [];
    }

    // Returns a summarized map of the network
    getNetworkMap() {
        let networkMap = [];
        for (const peer of this.peers.values()) {
            networkMap.push({ id: peer.getID(), host: peer.getHost(), port: peer.getPort() });
        }
        return networkMap;
    }

    // Update network map with data from other peers
    updateNetworkMap(data) {
        // const logger = this.logger;
        for (const peerData of data) {
            if (!this.peers.has(peerData.id)) {
                const newPeer = new Peer(peerData.host, peerData.port);
                this.addPeer(newPeer);
            }
        }
    }
}

