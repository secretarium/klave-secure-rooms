import { EncryptedKeyPair } from '@secretarium/connector';

export type KeyPair = EncryptedKeyPair & {
    id: string;
    name: string;
};

export type ActionData = {
    error: boolean;
    message?: string;
};

export type TransactionResult = {
    success: boolean;
    message: string;
};

export type TokenIdentityResult = {
    requestId: string;
    result: {
        klaveServerPublicKey: string;
        storageServerPublicKey: string;
    };
    message?: string;
};

export type ListUserRequestsResult = {
    requestId: string;
    result: string[];
    message?: string;
};

export type ListDrivesResult = {
    requestId: string;
    result: string[];
};

export type DriveContentResult = {
    requestId: string;
    result: {
        locked: boolean;
        files: DriveFile[];
    };
    message?: string;
};

export type DriveFile = {
    digestB64: string;
    name: string;
    id: string;
    key: string;
    tokenB64: string;
    type: string;
};

export type GetFileUploadTokenResult = {
    requestId: string;
    result: {
        tokenB64: string;
    };
};

export type DriveRole = {
    driveId: string;
    role: string;
};

export type GetUserContentResult = {
    requestId: string;
    result: {
        id: string;
        roles: DriveRole[];
    };
    message?: string;
};

export type GetFileUploadTokenInput = {
    driveId: string;
    digestB64: string;
};

export type UpdateDriveInput = {
    driveId: string;
    operation: 'addFile' | 'removeFile' | 'lock';
    file: {
        name: string;
        digestB64: string;
        type: string;
        key: string;
        tokenB64: string;
    };
};

export type UserRequestInput = {
    driveId: string;
    role: string;
};

export type ApproveUserRequestInput = {
    userRequestId: string;
};

export type SetIdentitiesInput = {
    resetKlaveServer: boolean;
    resetStorageServer: boolean;
};

export type ExportStorageServerPrivateKeyInput = {
    format: string;
};
