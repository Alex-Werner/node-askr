import { Askr } from './index.js';


(async () => {

    const node = new Askr({
        name: 'bob',
        workspace: 'workspace1',
        keys: true
    });

    await node.start();

    const secretKey = ''; // Secret key from Alice (generated by Alice)
    // TODO: Have alice to be able to add bob's key as accepted peer instead and verify its public/private key pair

    // We request the state from the node
    const aliceNodeConnectedState = await node.ask({
        host: 'localhost',
        port: 8800,
        workspace: 'workspace1',
        command: 'STATE_REQUEST',
        data: {}
    }, secretKey)

    console.log(aliceNodeConnectedState.data)

    const req = await node.ask({
        host: 'localhost',
        port: 8800,
        workspace: 'workspace1',
        command: 'STATE_SET',
        data: {
            key: 'config',
            value: {active:false}
        }
    })

    console.log(await node.ask({
        host: 'localhost',
        port: 8800,
        workspace: 'workspace1',
        command: 'STATE_REQUEST',
        data: {}
    }))
})();