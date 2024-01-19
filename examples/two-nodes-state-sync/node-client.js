import Client from './src/primitives/Client/Client.js';

(async ()=>{
    const client = new Client({
        workspace: 'workspace1',
        port: 8800,
        host: 'localhost',
    });
    client.connect();
})()
