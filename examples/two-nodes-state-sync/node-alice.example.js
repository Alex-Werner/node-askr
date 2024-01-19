import { Askr } from './index.js';

(async () => {

    const alice = new Askr({
        name: 'alice',
        workspace: 'workspace1',
        keys: true, // This will generate a keypair for the client, we expect bob's request to have been signed with this secret
        useConnectedState: true,
    });

    await alice.start();

    alice.connectedState.set('config', {
        active: true
    });
})();
