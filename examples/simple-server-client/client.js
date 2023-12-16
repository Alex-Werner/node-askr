import { Client } from '../../index.js';

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
