// Peer.js
import Logger from "hermodlog";
import getPort from "./method/getPort.js";
import getHost from "./method/getHost.js";
import getID from "./method/getId.js";
import close from "./method/close.js";
import connect from "./method/connect.js";
import send from "./method/send.js";

export default class Peer {
    constructor(host, port, logger) {
        this.host = host;
        this.port = port;
        this.connected = false;

        // Might require a better way to identify peers
        this.id = `${host}:${port}`;

        // The underlying socket connection to this peer
        this.connection = null;
        this.logger = (logger ?? new Logger()).module(`Peer(${this.id})`);;
    }
}

Peer.prototype.close = close;
Peer.prototype.connect = connect;
Peer.prototype.send = send;
Peer.prototype.getID = getID;
Peer.prototype.getHost = getHost;
Peer.prototype.getPort = getPort;
