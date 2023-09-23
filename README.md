# askr
Stupid Simple Microservices dispatcher

## Installation

```bash
npm i askr
```

## Usage

```js
import { Askr } from './Askr.js';

// Create first node on port 8800
const node1 = new Askr();
node1.start();

// Listen for 'myCommand.myAction' on node1
node1.on('myCommand.myAction', (event) => {
    console.log(`Node1 received event:`, event);
});

// Let's give a small delay so that node1 is ready to accept connections.
setTimeout(() => {
    // Create second node on port 8801
    const node2 = new Askr();
    node2.start();

    // Add node1 as a peer to node2
    node2.addPeer('localhost', 8800);

    // Give another delay to let the handshake complete.
    setTimeout(() => {
        // Emit 'myCommand.myAction' from node2
        const event = {
            value: "This is a test event from Node2"
        };
        node2.emit('myCommand.myAction', event);
    }, 1000);

}, 1000);
```


See usage examples in [usage.example.js file](./usage.example.js).
## Askr Protocol Specification

### Overview
The `Askr` protocol facilitates peer-to-peer communication between nodes in a network. Each node maintains its beacon and peer list. Nodes can send and listen to events, each identified by a command-action string, e.g., "command.action".

### Components

1. **Beacon**: Manages a node's server and handles the emission of events.
2. **Peer**: Represents a connection to a remote node, handling the reception of events and responses.
3. **PeerList**: Manages a collection of `Peer` objects and offers utilities to update and retrieve peers.
4. **Askr**: Acts as the primary interface for using the protocol. Orchestrates `Beacon`, `Peer`, and `PeerList` components.

### Features & Functionalities:

#### 1. Askr

- **start()**: Initializes and starts the beacon to listen for incoming connections. It sets up listeners for events like handshake messages from other nodes.

- **addPeer(host, port)**: Creates a new peer and adds it to the peer list. Sends a handshake to the newly added peer.

- **handshake(peer)**: Sends a handshake message to the specified peer, containing information about its own network map.

- **on(commandAction, callback)**: Registers a callback function to be executed when a specific `command.action` event is received.

- **emit(commandAction, data)**: Emits a specified `command.action` event with the accompanying data to all peers listening for that event.

#### 2. Beacon

Used to propagate messages and events to peers.

- **start()**: Initiates the server to listen for incoming connections and data.

- **emitToPeer(peer, data)**: Sends data to a specific peer.

#### 3. Peer

- **connect()**: Initiates a connection to the specified peer. Sets up listeners to handle incoming data and manage connection events.

- **send(data)**: Sends a JSON-serialized message to the connected peer.

- **close()**: Closes the connection to the peer.

#### 4. PeerList

PeerList maintains a collection of Peer objects and their subscriptions to events.

- **addPeer(peer)**: Adds a new peer to the list.

- **getPeer(id)**: Retrieves a peer by its unique identifier.

- **removePeer(id)**: Removes a peer by its identifier.

- **getNetworkMap()**: Provides a map of all known peers in the network.

### Workflow:

1. An `Askr` node starts its `Beacon`, which initializes a server to listen for incoming connections.

2. Another node wishing to connect will instantiate a `Peer` object for the target and initiate a connection.

3. Upon establishing the connection, a handshake is executed. The connecting node sends its network map to the target node.

4. Nodes can use the `on` method to set up listeners for specific events. When such an event is received, the registered callback is executed.

5. Nodes use the `emit` method to broadcast events. The `Beacon` sends the event to all relevant peers who have shown interest in that specific event type.

### Network Propagation:

The handshake process ensures each node has a view of the overall network. When a node joins and connects to another, it shares its known peer list, and both nodes update their lists accordingly. Over time, and with more connections, nodes create a more complete map of the network.
