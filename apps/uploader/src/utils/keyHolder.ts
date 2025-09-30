import fs from 'node:fs';
import path from 'node:path';
import { subtle } from 'node:crypto';
import { ClearKeyPair, Key, SCP, Utils } from '@secretarium/connector';

const keyFolder = process.env.NX_APP_KEY_FOLDER ?? 'keys';
const idKeyName = process.env.IKEY ?? 'i.key.pem';
const signKeyName = process.env.SKEY ?? 's.key.pem';
const driveKeyName = process.env.RKEY ?? 'r.key.pem';
const deploymentId = process.env.DID ?? process.env.NX_APP_KLAVE_CONTRACT ?? 'master--g.f457c26c.drive.IntegrationTests.klave.network';
const secretariumEndpoint = process.env.NX_APP_SECRETARIUM_GATEWAYS?.split('#')?.[2] ?? 'wss://klave-dev.secretarium.org';

const klave = new SCP({
    // logger: console
});

export class KeyHolder {
    static idKey?: Key;
    static signKey?: CryptoKey;
    static driveKey?: CryptoKey;
    static async loadServerIdentity() {
        const keysPath = path.resolve(path.join(__dirname, keyFolder));
        console.info('Keys path:', keysPath);
        const idKeyPath = path.resolve(keysPath, idKeyName);
        if (!fs.existsSync(idKeyPath)) {
            fs.mkdirSync(keysPath, { recursive: true });
            console.info('Generating Klave identity...');
            KeyHolder.idKey = await Key.createKey();
            await fs.writeFileSync(idKeyPath, JSON.stringify(await KeyHolder.idKey.exportKey()));
        } else {
            console.info('Loading Klave identity...');
            const idKeyContent = fs.readFileSync(idKeyPath);
            console.info('Id key content:', idKeyContent.toString());
            const idKey = JSON.parse(idKeyContent.toString()) as ClearKeyPair;
            KeyHolder.idKey = await Key.importKey(idKey);
        }

        klave.onError((e) => {
            console.error(e);
        });

        await klave.connect(secretariumEndpoint, KeyHolder.idKey);

        await new Promise<void>((gresolve, greject) => {
            let passCount = 0;
            const blockUntilAdmin = async () => {
                if (passCount === 1) {
                    console.info('Waiting to be granted rights...');
                }
                passCount++;
                const tx = klave.newTx(deploymentId, 'getUserContent', undefined, {});
                const userContent: any = await new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        if (result.result)
                            return resolve(result.result);
                        if (result.message === 'User not found'){
                            const txcu = klave.newTx(deploymentId, 'createUserRequest', undefined, {
                                driveId: 'super',
                                role: 'admin'
                            });
                            txcu.onResult(() => {
                                return setTimeout(blockUntilAdmin, 5000);
                            });
                            txcu.onError((error) => {
                                console.error('Could not create user', error)
                                reject();
                            });
                            txcu.send();
                        }
                        else
                        return setTimeout(blockUntilAdmin, 5000);
                    });
                    tx.onError((error) => {
                        console.error('User info could not be fetched', error)
                        reject();
                    });
                    tx.send();
                });
                if (Array.isArray(userContent.roles)) {
                    const drive = userContent.roles[0];
                    if (drive) {
                        if (drive.role === 'admin') {
                            return gresolve()
                        }
                        else
                            return setTimeout(blockUntilAdmin, 5000);
                    } else {
                        return setTimeout(blockUntilAdmin, 5000);
                    }
                }
            }
            blockUntilAdmin().catch(greject);
        });

        const signKeyPath = path.resolve(keysPath, signKeyName);
        if (!fs.existsSync(signKeyPath)) {
            // throw new Error('The signing key must be a file');
            console.info('Obtaining the signing key...');
            const txr = klave.newTx(deploymentId, 'resetIdentities', undefined, { resetKlaveServer: true, resetStorageServer: true });
            await new Promise((resolve, reject) => {
                txr.onResult((result) => {
                    if (result.success) return resolve(result.message);
                    reject();
                });
                txr.onError((error) => {
                    console.error('Indentity reset failed:', error)
                    reject();
                });
                txr.send();
            });
            const txe = klave.newTx(deploymentId, 'exportStorageServerPrivateKey', undefined, { format: 'pkcs8' });
            const newSignKeyB64: string = await new Promise((resolve, reject) => {
                txe.onResult((result) => {
                    console.info('Key export result:', result);
                    if (result.success) return resolve(result.message);
                    reject();
                });
                txe.onError((error) => {
                    console.error('Key export failed:', error)
                    reject();
                });
                txe.send();
            });
            const newSignKeyContent = Utils.fromBase64(newSignKeyB64);
            fs.writeFileSync(signKeyPath, newSignKeyContent);
        }
        const signKeyContent = fs.readFileSync(signKeyPath);
        KeyHolder.signKey = await subtle.importKey(
            'pkcs8',
            signKeyContent,
            {
                namedCurve: 'P-256',
                name: 'ECDSA'
            },
            true,
            ['sign']
        );

        const driveKeyPath = path.resolve(keysPath, driveKeyName);
        if (!fs.existsSync(driveKeyPath)) {
            console.info('Obtaining the drive key...');
            // throw new Error('The signing key must be a file');
            const tx = klave.newTx(deploymentId, 'getPublicKeys', undefined, {});
            const newDriveKeyPEM: string = await new Promise((resolve, reject) => {
                tx.onResult((result) => {
                    if (result.result) return resolve(result.result.klaveServerPublicKey);
                    reject();
                });
                tx.onError((error) => {
                    console.error('newDriveKeyPEM error', error)
                    reject();
                });
                tx.send();
            });

            const newDriveKeyB64 = Array.from(newDriveKeyPEM.toString().matchAll(/KEY-----\s*([\S]*?)\s*-----/mg))[0][1];
            console.info('New drive key (base64):', newDriveKeyB64);
            const newDriveKeyContent = Utils.fromBase64(newDriveKeyB64);
            fs.writeFileSync(driveKeyPath, newDriveKeyContent);
        }
        const driveKeyContent = fs.readFileSync(driveKeyPath);
        KeyHolder.driveKey = await subtle.importKey(
            'spki',
            driveKeyContent,
            {
                namedCurve: 'P-256',
                name: 'ECDSA'
            },
            true,
            ['verify']
        );

        console.log('Keys loaded successfully');
    }
}

export default KeyHolder;
