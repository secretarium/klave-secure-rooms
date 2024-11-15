import { Context, Ledger, Notifier, JSON, Crypto } from "@klave/sdk";
import { success, error } from "../klave/types";
import { KeysList, TokenIdentityOutput } from "./outputs/types";
import { encode as b64encode } from 'as-base64/assembly';
import { KeyECC } from "@klave/sdk/assembly/crypto";
import { SubtleCrypto } from "@klave/sdk/assembly/crypto/crypto_subtle";

const KeysTable = "KeysTable";

/**
 * An Keys is associated with a list of keys and holds keys.
 */
@JSON
export class Keys {
    klaveServer_private_key: string;
    storageServer_private_key: string;

    constructor() {
        this.klaveServer_private_key = "";
        this.storageServer_private_key = "";
    }

    /**
     * load the keys from the ledger.
     * @returns true if the keys was loaded successfully, false otherwise.
     */
    static load(): Keys {
        let keysTable = Ledger.getTable(KeysTable).get("ALL");
        if (keysTable.length == 0) {
            // success(`New Keys Table created successfully`);
            return new Keys;
        }
        let wlt = JSON.parse<Keys>(keysTable);
        // success(`Keys loaded successfully: ${keysTable}`);
        return wlt;
    }

    /**
     * save the keys to the ledger.
     */
    save(): void {
        let keysTable = JSON.stringify<Keys>(this);
        Ledger.getTable(KeysTable).set("ALL", keysTable);
        // success(`Keys saved successfully: ${keysTable}`);
    }

    /**
     * Generate a key to the list of keys.
     * @param keyId The id of the key to add.
     * @param keyInput The details (algorithm, extractable) of the key to add.
     */
    generateKlaveServerPrivateKey(): boolean {
        let key = Crypto.ECDSA.generateKey(this.klaveServer_private_key);
        if (key === null || key.data === null) {
            success(`KlaveServer private key could not be created.`);
            return false;
        }
        this.klaveServer_private_key = (key.data as KeyECC).name;
        return true;
    }

    /**
     * Generate a key to the list of keys.
     * @param keyId The id of the key to add.
     * @param keyInput The details (algorithm, extractable) of the key to add.
     */
    generateStorageServerPrivateKey(): boolean {
        let key = Crypto.ECDSA.generateKey(this.storageServer_private_key);
        if (key === null || key.data === null) {
            success(`KlaveServer private key could not be created.`);
            return false;
        }
        this.storageServer_private_key = (key.data as KeyECC).name;
        return true;
    }

    /**
     * Import a public key corresponding to a storageServer
     * @param keyId The id of the key to add.
     * @param keyInput The details (algorithm, extractable) of the key to add.
     */
    exportStorageServerPrivateKey(format: string = 'raw'): boolean {
        if (this.storageServer_private_key == "") {
            error(`Storage server private key does not exist.`);
            return false;
        }

        let storageServer_key = Crypto.ECDSA.getKey(this.storageServer_private_key);
        if (!storageServer_key) {
            error("Issue retrieving the key: " + this.storageServer_private_key);
            return false;
        }
        //let storageServer_format = Crypto.ECDSA.exportKey(storageServer_key.name, format);
        let cryptoKey = SubtleCrypto.loadKey(this.storageServer_private_key);
        if (!cryptoKey || cryptoKey.data === null) {
            error("Issue loading the key: " + this.storageServer_private_key);
            return false;
        }
        let storageServer_format = SubtleCrypto.exportKey(format, cryptoKey.data);
        if (!storageServer_format || storageServer_format.data === null) {
            error("Issue exporting the key: " + this.storageServer_private_key);
            return false;
        }
        // success(b64encode(Crypto.Utils.convertToUint8Array(storageServer_format)));
        let arrayBuffer = storageServer_format.data as ArrayBuffer;

        success(String.UTF8.decode(arrayBuffer));
        //success(arrayBuffer.toString());
        return true;
    }

    /**
     * Remove a key from the list of keys.
     * @param keyId The id of the key to remove.
     */
    clearKeys(): boolean {
        this.klaveServer_private_key = "";
        this.storageServer_private_key = "";
        //It is not possible to override the previously imported key
        success("Both klaveServer and storageServer keys now removed successfully");
        return true;
    }

    /**
     * list the current klaveServer and storageServer keys.
     * @returns
     */
    list(): void {
        if (this.klaveServer_private_key == "" && this.storageServer_private_key == "") {
            success("No keys have been set yet.");
            return;
        }

        let klaveServer_key = Crypto.ECDSA.getKey(this.klaveServer_private_key);
        if (!klaveServer_key) {
            error("Issue retrieving the key: " + this.klaveServer_private_key);
            return;
        }
        let klaveServer_spki_pem = klaveServer_key.getPublicKey().getPem();

        let storageServer_key = Crypto.ECDSA.getKey(this.storageServer_private_key);
        if (!storageServer_key) {
            error("Issue retrieving the key: " + this.storageServer_private_key);
            return;
        }
        let storageServer_spki_pem = storageServer_key.getPublicKey().getPem();

        let keysList = new KeysList(klaveServer_spki_pem, storageServer_spki_pem);
        Notifier.sendJson<TokenIdentityOutput>({
            requestId: Context.get('request_id'),
            result: keysList
        });
    }

    /**
     * Check if both keys are set.
     * @returns
     */
    isSet(): boolean {
        if (this.klaveServer_private_key == "" || this.storageServer_private_key == "") {
            return false;
        }
        return true;
    }
}