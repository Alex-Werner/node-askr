// PeerList.js
import Peer from '../Peer.js';
import addPeer from "./methods/addPeer.js";
import getPeers from "./methods/getPeers.js";
import getPeer from "./methods/getPeer.js";
import removePeer from "./methods/removePeer.js";
import updatePeer from "./methods/updatePeer.js";
import getNetworkMap from "./methods/getNetworkMap.js";

class PeerList {
    constructor() {
        // Contains all connected peers
        this.peers = new Map(); // Map of peerID to Peer object

        // Contains the map of all actions handled by peers
        this.actions = new Map();


        // Contains the map of all topics provided by peers
        this.topics = new Map();
    }

    // Register a new action
    registerAction(action, callback) {
        this.actions.set(action, callback);
    }

    // Register a new topic
    registerTopic(topic, callback) {
        this.topics.set(topic, callback);
    }

    // registerInterest(topic, peerID) {
    //     if (!this.topicInterests.has(topic)) {
    //         this.topicInterests.set(topic, new Set());
    //     }
    //     this.topicInterests.get(topic).add(peerID);
    // }
    //
    // getPeersByInterest(topic) {
    //     if (this.topicInterests.has(topic)) {
    //         return Array.from(this.topicInterests.get(topic)).map(peerID => this.getPeer(peerID));
    //     }
    //     return [];
    // }
    //
    // // Update network map with data from other peers
    // updateNetworkMap(data) {
    //     // const logger = this.logger;
    //     for (const peerData of data) {
    //         if (!this.peers.has(peerData.id)) {
    //             const newPeer = new Peer(peerData.host, peerData.port);
    //             this.addPeer(newPeer);
    //         }
    //     }
    // }
}


PeerList.prototype.addPeer = addPeer;
PeerList.prototype.getPeers = getPeers;
PeerList.prototype.getPeer = getPeer;
PeerList.prototype.updatePeer = updatePeer;
PeerList.prototype.removePeer = removePeer;
PeerList.prototype.getNetworkMap = getNetworkMap;
export default PeerList;
