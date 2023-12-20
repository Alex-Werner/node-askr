export default function emitToPeer(peer, message) {
    try {
        peer.write(JSON.stringify(message));
    } catch (err) {
        console.error('Error sending message to peer:', err);
    }
}
