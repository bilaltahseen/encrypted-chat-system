import { Socket, io } from "socket.io-client";
import { IEncryption } from "./encryption";

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    receive: (name: string, message: string) => void;
    private: (from: string, msg: string) => void;
}

interface ClientToServerEvents {
    noArg: () => void;
    send: (name: string, message: string) => void;
    joinRoom: (roomId: string) => void;
    private: (to: string, msg: string) => void;

}

interface IClientSocket {
    connect: (roomId: string) => void;
    send: (name: string, message: string) => void;
    handlePrivateMessage: () => void;

}

export default class ClientSocket implements IClientSocket {

    private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
    private url: string;
    private encryption: IEncryption;


    constructor(url: string, encryption: IEncryption) {
        this.url = url;
        this.encryption = encryption;
    }


    public connect(): void {
        try {
            if (this.socket === null) {
                this.socket = io(this.url, {});
                console.log('Connected to server', this.socket.id);
            }
        } catch (error) {
            console.log(`Error connecting to server: ${error}`);
        }
    }


    public handlePrivateMessage(): void {
        if (this.socket !== null) {
            this.socket.on('private', (from, msg) => {
                const decMessage = this.encryption.decrypt(msg);
                console.log(`Private message received from ${from}: ${decMessage}`);
            });
        }
    }


    public send(to: string, message: string): void {
        console.log(`Sending message to server: ${message}`);
        if (this.socket !== null) {
            const encMessage = this.encryption.encrypt(message);
            this.socket.emit("private", to, encMessage).compress(true);
        }
    }


}