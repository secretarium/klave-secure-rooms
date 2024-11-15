import secretariumHandler from './secretarium-handler';
import {
    TransactionResult,
    TokenIdentityResult,
    ListDataRoomsResult,
    DataRoomContentResult,
    GetFileUploadTokenInput,
    GetFileUploadTokenResult,
    UpdateDataRoomInput,
    UserRequestInput,
    ApproveUserRequestInput,
    SetIdentitiesInput,
    GetUserContentResult,
    ListUserRequestsResult
} from './types';

export const klaveContract = import.meta.env.VITE_APP_KLAVE_CONTRACT;

export const isConnected = () => secretariumHandler.isConnected();

export const waitForConnection = () =>
    new Promise<void>((resolve) => {
        const loopCondition = () => {
            const isConnected = secretariumHandler.isConnected();
            if (isConnected) resolve();
            else setTimeout(loopCondition, 1000);
        };
        loopCondition();
    });

export const createSuperAdmin = async (): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(klaveContract, 'createSuperAdmin', {}, `createSuperAdmin-${Math.random()}`)
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const createUser = async (input: UserRequestInput): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(klaveContract, 'createUserRequest', input, `createUser-${Math.random()}`)
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const getUser = async (): Promise<GetUserContentResult> =>
    waitForConnection()
        .then(() => secretariumHandler.request(klaveContract, 'getUserContent', {}, `getUser-${Math.random()}`))
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const listUsers = async (): Promise<ListUserRequestsResult> =>
    waitForConnection()
        .then(() => secretariumHandler.request(klaveContract, 'listUserRequests', {}, `listUsers-${Math.random()}`))
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const approveUser = async (input: ApproveUserRequestInput): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(klaveContract, 'approveUserRequest', input, `approveUser-${Math.random()}`)
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const resetIdentities = async (input: SetIdentitiesInput): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(klaveContract, 'resetIdentities', input, `resetIdentities-${Math.random()}`)
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const exportStorageServerPrivateKey = async (format?: string): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(
                klaveContract,
                'exportStorageServerPrivateKey',
                { format },
                `exportStorageServerPrivateKey-${Math.random()}`
            )
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const setTokenIdentity = async (token?: string): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(
                klaveContract,
                'setTokenIdentity',
                { token },
                `setTokenIdentity-${Math.random()}`
            )
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const createDataRoom = async (): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(
                klaveContract,
                'createDataRoom',
                { dataRoomId: '' },
                `createDataRoom-${Math.random()}`
            )
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const updateDataRoom = async (input: UpdateDataRoomInput): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(klaveContract, 'updateDataRoom', input, `updateDataRoom-${Math.random()}`)
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const getPublicKeys = async (): Promise<TokenIdentityResult> =>
    waitForConnection()
        .then(() => secretariumHandler.request(klaveContract, 'getPublicKeys', {}, `getPublicKeys-${Math.random()}`))
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const getFileUploadToken = async (
    getFileUploadTokenInput: GetFileUploadTokenInput
): Promise<GetFileUploadTokenResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(
                klaveContract,
                'getFileUploadToken',
                getFileUploadTokenInput,
                `getFileUploadToken-${Math.random()}`
            )
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const listDataRooms = async (): Promise<ListDataRoomsResult> =>
    waitForConnection()
        .then(() => secretariumHandler.request(klaveContract, 'listDataRooms', {}, `listDataRooms-${Math.random()}`))
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const getDataRoomContent = async (dataRoomId: string): Promise<DataRoomContentResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(
                klaveContract,
                'getDataRoomContent',
                { dataRoomId },
                `getDataRoomContent-${Math.random()}`
            )
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

// -------------------- MOCK WEB SERVER --------------------

const mock_web_server_klave_contract = 'test_sdk_smart_contract';

const rmPemDecorators = (pemFile: string, type: string) => {
    pemFile = pemFile.replace('-----BEGIN ' + type + ' KEY-----', '');
    pemFile = pemFile.replace('-----END ' + type + ' KEY-----', '');
    pemFile = pemFile.replace(/\n/g, '');
    pemFile = pemFile.replace(/\r/g, '');
    return pemFile;
};

export const setStorageServerTokenIdentity = async (pem: string): Promise<TransactionResult> =>
    waitForConnection()
        .then(() => {
            const pemContents = rmPemDecorators(pem, 'EC PRIVATE');
            const importKeyInput = {
                keyName: 'storageServerPrivateKey',
                key: {
                    format: 'pkcs8',
                    keyData: pemContents,
                    algorithm: 'secp256r1',
                    extractable: false,
                    usages: ['sign']
                }
            };

            return secretariumHandler.request(
                mock_web_server_klave_contract,
                'importKey',
                importKeyInput,
                `importKey-${Math.random()}`
            );
        })
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

// export const importPrivateKey = async (pem: string): Promise<TransactionResult> =>
//     waitForConnection()
//         .then(() => {
//             const pemContents = rmPemDecorators(pem, 'EC PRIVATE');
//             const importKeyInput = {
//                 keyName: 'webServerPrivateKey',
//                 key: {
//                     format: 'sec1',
//                     keyData: pemContents,
//                     algorithm: 'secp256r1',
//                     extractable: true,
//                     usages: ['sign']
//                 }
//             };

//             return secretariumHandler.request(
//                 mock_web_server_klave_contract,
//                 'importKey',
//                 importKeyInput,
//                 `importKey-${Math.random()}`
//             );
//         })
//         .then(
//             (tx) =>
//                 new Promise((resolve, reject) => {
//                     tx.onResult((result) => {
//                         resolve(result);
//                     });
//                     tx.onError((error) => {
//                         reject(error);
//                     });
//                     tx.send().catch(reject);
//                 })
//         );

export const getPublicKey = async (keyName: string): Promise<TransactionResult> =>
    waitForConnection()
        .then(() => {
            const getPublicKeyInput = {
                keyName: keyName,
                format: 'spki'
            };

            return secretariumHandler.request(
                mock_web_server_klave_contract,
                'getPublicKey',
                getPublicKeyInput,
                `getPublicKey-${Math.random()}`
            );
        })
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const importPublicKey = async (pem: string): Promise<TransactionResult> =>
    waitForConnection()
        .then(() => {
            const pemContents = rmPemDecorators(pem, 'PUBLIC');
            const importKeyInput = {
                keyName: 'klaveServerPublicKey',
                key: {
                    format: 'spki',
                    keyData: pemContents,
                    algorithm: 'secp256r1',
                    extractable: true,
                    usages: ['verify']
                }
            };

            return secretariumHandler.request(
                mock_web_server_klave_contract,
                'importKey',
                importKeyInput,
                `importKey-${Math.random()}`
            );
        })
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const sign = async (keyName: string, clearText: string): Promise<TransactionResult> =>
    waitForConnection()
        .then(() => {
            const signInput = {
                keyName: keyName,
                clearText: clearText
            };

            return secretariumHandler.request(
                mock_web_server_klave_contract,
                'sign',
                signInput,
                `sign-${Math.random()}`
            );
        })
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const verify = async (keyName: string, clearText: string, signatureB64: string): Promise<TransactionResult> =>
    waitForConnection()
        .then(() => {
            const verifyInput = {
                keyName: keyName,
                clearText: clearText,
                signatureB64: signatureB64
            };

            return secretariumHandler.request(
                mock_web_server_klave_contract,
                'verify',
                verifyInput,
                `verify-${Math.random()}`
            );
        })
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );
