/**
 * Return a random cryptographic pair of keys that allows to sign and verify messages
 * @param length
 */
const generateRandomPair = async (length = 2048) => {
    let keys;

    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        // Browser environment
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: length,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: "SHA-256",
            },
            true,
            ["sign", "verify"]
        );

        const publicKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
        const privateKey = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);

        keys = {
            publicKey,
            privateKey
        };
    } else if (typeof process !== 'undefined') {
        // Node.js environment
        const { generateKeyPairSync } = await import('crypto');
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: length,
            publicKeyEncoding: {
                type: 'spki',
                format: 'der'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'der'
            }
        });

        console.log(publicKey, privateKey)

        keys = {
            publicKey: publicKey.toString('hex'),
            privateKey: privateKey.toString('hex')
        };
    } else {
        throw new Error('Unsupported environment for key generation');
    }

    return keys;
};
export default generateRandomPair;
