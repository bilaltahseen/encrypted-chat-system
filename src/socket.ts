import { Application } from "express";
import { Server } from "http";
import { Server as SocketServer } from "socket.io";

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    send: (name: string, message: string, roomId: string) => void;
    joinRoom: (roomId: string) => void;
    private: (anotherSocketId: string, msg: string) => void;

}

interface ClientToServerEvents {
    receive: (name: string, message: string) => void;
    private: (anotherSocketId: string, msg: string) => void;

}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    message: string;
}

interface ISocket {
    create: (server: Server) => void;
    handlePrivateMessage: () => void;
}


export default class Socket implements ISocket {
    private io: SocketServer<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData> | null = null;

    constructor() { }

    public create(server: Server): void {
        if (this.io === null) {
            this.io = new SocketServer<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>(server, {});
            console.log('Socket created');
        }
    }

    public handlePrivateMessage(): void {
        this.io?.on('connection', (socket) => {
            socket.on("private", (anotherSocketId, msg) => {
                console.log(`Private message received from ${anotherSocketId}: ${msg}`,socket.id);
                socket.to(anotherSocketId).emit("private", socket.id, msg);
            });
        });
    }

}