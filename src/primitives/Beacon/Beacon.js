import Logger from "hermodlog";
import getHost from '../../utils/getHost.js';

import addPeer from './methods/addPeer.js';
import getPath from "./methods/getPath.js";
import emitToPeer from "./methods/emitToPeer.js";
import subscribe from "./methods/subscribe.js";
import emit from "./methods/emit.js";
import on from "./methods/on.js";
import start from "./methods/start.js";
class Beacon {
    constructor(props = {}) {
        this.server = null;
        this.peers = new Map(); // Key: commandAction, Value: Array of connected sockets (peers) interested in the commandAction.
        this.callbacks = {}; // Callbacks for handling different message types.

        this.host = props.host ?? getHost();
        this.port = props.port ?? 8800;

        this.logger = (props.logger ?? new Logger().context('Beacon')).module(`Beacon(${this.port})`)
    }
}

Beacon.prototype.subscribe = subscribe;
Beacon.prototype.emit = emit;
Beacon.prototype.on = on;
Beacon.prototype.start = start;
Beacon.prototype.emitToPeer = emitToPeer;
Beacon.prototype.getPath = getPath;
Beacon.prototype.addPeer = addPeer;
export default Beacon;
