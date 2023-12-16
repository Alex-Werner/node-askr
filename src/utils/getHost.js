import os from 'os';
function getHost() {
    const networkInterfaces = os.networkInterfaces();

    for (let ifaceName in networkInterfaces) {
        const iface = networkInterfaces[ifaceName];
        for (let alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1'; // default to localhost if no external IP found
}

export default getHost;
