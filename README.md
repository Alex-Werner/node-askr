# node-askr
    
[![npm version](https://badge.fury.io/js/node-askr.svg)](https://badge.fury.io/js/node-askr)

Stupid Simple Microservices dispatcher

## Description

Node Askr is a simple protocol that helps you to build a network of microservices that can communicate with each other.   
It also allows an external Client to pass along command, listen or emit message so that the microservices can react to it.

## Why
Meant to help you build distributed applications with the least amount of effort or tool (useful for prototyping and research).
Meant with performance in mind, it will help you to build a network of microservices that can communicate with each other.

## Current Status

For now, it only allow a simple server / client communication, with no network mapping and auto discovery but events dispatching and command sending is working.
Careful if you are using this on an open network, as the keys signature process is not yet done, anyone can access your connected state currently.  

## Features

- [X] Protocol for communication and command dispatching
- [X] Simple server / client (no network mapping and auto discovery)
- [X] Events dispatching
- [X] Command sending (with response)
- [X] Connected State

## Roadmap
- [] Authentication
- [] Peer list exchange and synchronization (all nodes have the full view of the network)
- [] Map Message dispatching
- [] Network mapping and auto discovery
- [] Network State Sync
- [] Network dispatching (relay message to the right node via local mesh network)
- [] raw-ify p2p communication and compression

## Final Goal

The final goal is that you just connect to a single point in your network, and get ability to monitor and control all your microservices from within all your authorized microservices or terminal.
It would work within a workspace and handle hotswapping or new microservices joining the network to distribute the load and ensure your network stays connected without GB of bloatware.    

## Usage 

### Simple Server / Client (no network mapping and auto discovery)

In below example, we will create a simple server and client that will communicate with each other.  
Server can be started (it will then emit time every seconds), stopped and asked to fetch the current time.  
Client will ask for time, then start, wait 5s and stop the server.  


`server.js` - Simulate an microservice agent that would fetch and emit info to a system.

```js
import {Askr} from 'node-askr';

const agentNode = new Askr({
    name: 'agent'
});
agentNode.start();

function fetchTime() {
    const event = {
        type: 'FETCHED_TIME',
        payload: Date.now()
    }
    return event;
}

let interval;

function fetchAndBroadcastTime() {
    const event = fetchTime();
    console.log({event})
    agentNode.emit(event.type, event.payload);
};

function start() {
    interval = setInterval(fetchAndBroadcastTime, 1000);
}

function stop() {
    clearInterval(interval);
}

// Assign a listener to a command "start", "stop" and "fetch"
agentNode.on('start', (event) => {
    start();
});

agentNode.on('stop', (event) => {
    stop();
});

agentNode.on('fetch', async (event, peer) => {
    return fetchTime();
});
```

`client.js` - Simulate a client that would listen to the agent's event and react to it (send commands).

```js
import { Client } from 'node-askr';

(async () => {
    const client = new Client({
        url: 'ws://localhost:8800',
    });

    await client.connect();

    const fetchCommand = await client.send('fetch');
    console.log('fetchCommand', fetchCommand);


    client.on('FETCHED_TIME', (data) => {
        console.log('FETCHED_TIME', data);
    });


    const sendCommand = await client.send('start');
    console.log('sendCommand', sendCommand);


    // wait 5 seconds
    await new Promise((resolve) => {
        setTimeout(resolve, 5000);
    });

    const stopCommand = await client.send('stop');
    console.log('stopCommand', stopCommand);
})();
```

## Examples

See the `examples` folder for more examples.

