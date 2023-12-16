import {Askr} from '../../index.js';

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

