import * as crypto from 'crypto';

export interface IEncryption {
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
}

export default class Encryption implements IEncryption {
    private readonly algorithm: string;
    private readonly key: Buffer;
    private readonly iv: Buffer;

    constructor(key: string, iv: string) {
        this.algorithm = 'aes-256-cbc';
        // Convert key and iv from strings to buffers
        this.key = Buffer.from(key, 'hex');
        this.iv = Buffer.from(iv, 'hex'); // Ensure the IV is properly encoded as hexadecimal
    }

    public encrypt(text: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    public decrypt(text: string): string {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(text, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
