import Beacon from '../Beacon/Beacon.js';
import PeerList from '../PeerList/PeerList.js';
import Logger from 'hermodlog';

import generateRandomString from '../../utils/generateRandomString.js';
import emit from "./methods/emit.js";
import addPeer from "./methods/addPeer.js";
import getPath from "./methods/emit.js";
import handshake from "./methods/handshake.js";
import on from "./methods/on.js";
import start from "./methods/start.js";

class Askr {
    constructor(props = {}) {
        let name = `askr-`;
        if(props.name) name += `${props.name}-`;

        this.id =  name + generateRandomString(6);
        this.logger = new Logger().context(this.id);
        this.beacon = new Beacon({
            logger: this.logger
        });
        this.peerList = new PeerList();
        this.listeners = {};
    }

    _handleHandshake(data, senderPeer) {
        this.logger.method('_handleHandshake').log(`Received handshake from ${senderPeer.getID()}`);
        const {payload} = data;
        // Update the peer list with the received network map
        this.peerList.updateFromNetworkMap(payload);

        // senderPeer.send({
        //   type: 'handshake',
        //   payload: this.peerList.getNetworkMap()
        // });
    }
}

Askr.prototype.addPeer = addPeer;
Askr.prototype.emit = emit;
Askr.prototype.getPath = getPath;
Askr.prototype.handshake = handshake;
Askr.prototype.on = on;
Askr.prototype.start = start;
export default Askr;
