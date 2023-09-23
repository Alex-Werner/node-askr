import { Askr } from './src/Askr.js';
import {Peer} from "./src/Peer.js";
import {Beacon} from "./src/Beacon.js";


(async () => {

// Create first node on port 8800
//     const node1 = new Askr();
//     await node1.start();

// Listen for 'myCommand.myAction' on node1
//     node1.on('myCommand.myAction', (event) => {
//         console.log(`Node1 received event:`, event);
//     });


    const beacon = new Beacon();
    beacon.start();

    const beacon2 = new Beacon();
    beacon2.start();

    const peer = new Peer(beacon2.host, beacon2.port, beacon.logger);
    await peer.connect();
    // peer.send({
    //     type: 'handshake',
    //     payload: {
    //         host: beacon.host,
    //         port: beacon.port,
    //     }
    // });

    const peer2 = new Peer(beacon.host, beacon.port, beacon2.logger);
    await peer2.connect();

    // peer2.send({
    //     type: 'handshake',
    //     payload: {
    //         host: beacon2.host,
    //         port: beacon2.port,
    //     }
    // });

    // beacon.on('handshake', (data, el, senderPeer) => {
        // beacon.addPeer(data.host, data.port);
    // });
    // beacon2.on('handshake', (data, el, senderPeer) => {
        // beacon2.addPeer(data.host, data.port);
    // });



// Let's give a small delay so that node1 is ready to accept connections.
    setTimeout(() => {
        // Create second node on port 8801
        // const node2 = new Askr();
        // node2.start();

        // Add node1 as a peer to node2
        // node2.addPeer('localhost', 8800);

        // Give another delay to let the handshake complete.
        // setTimeout(() => {
        //     Emit 'myCommand.myAction' from node2
        // const event = {
        //     value: "This is a test event from Node2"
        // };
        // node2.emit('myCommand.myAction', event);
        // }, 1000);

    }, 1000);
})();

