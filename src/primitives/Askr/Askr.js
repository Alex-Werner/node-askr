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
import generateRandomPair from "../../utils/generateRandomPair.js";
import ConnectedState from "../ConnectedState/ConnectedState.js";

class Askr {
    constructor(props = {}) {
        let name = `askr-`;
        if(props.name) name += `${props.name}-`;

        this.id =  name + generateRandomString(6);
        this.workspace = props.workspace || 'global';

        this.logger = new Logger().context(this.id);
        this.beacon = new Beacon({
            logger: this.logger,
            port: props.port ?? 8800,
            host: props.host ?? 'localhost'
        });
        this.peerList = new PeerList();
        this.listeners = {};

        if(props.keys) {
            if(props.keys === true){
                // We are asked to generate keypairs, but needs to be async because of browser compatibility w/ packaging currently
                // FIXME.
                generateRandomPair(512)
                    .then((keypair) => {
                    this.keys = {
                        publicKey: keypair.publicKey,
                        privateKey: keypair.privateKey
                    }
                });
            } else{
                // We assume the keys are provided as an object
                this.keys = props.keys;
            }
        }
        if(props.useConnectedState){
            this.connectedState = new ConnectedState(props.connectedState);
        }

    }

    _handleHandshake(data, senderPeer) {
        this.logger.method('_handleHandshake').log(`Received handshake from ${senderPeer.getID()}`);
        const {payload} = data;
        // Update the peer list with the received network map
        // this.peerList.updateFromNetworkMap(payload);

        // senderPeer.send({
        //   type: 'handshake',
        //   payload: this.peerList.getNetworkMap()
        // });
    }

    async ask( props = {}) {
        return new Promise(async (resolve, reject) => {
            const peer = this.addPeer(props.host, props.port);
            await peer.connect();

            const message = {
               workspace: props.workspace,
               mid: props?.messageId ?? 1,
                command: props.command,
                data: props.data ?? {}
            }

            message.data.signature = true;

            peer.send(message);
            peer.connection.on('data', (data) => {
                const response = JSON.parse(data.toString());
                resolve(response);
            });
        });
    }
}

Askr.prototype.addPeer = addPeer;
Askr.prototype.emit = emit;
Askr.prototype.getPath = getPath;
Askr.prototype.handshake = handshake;
Askr.prototype.on = on;
Askr.prototype.start = start;
export default Askr;
