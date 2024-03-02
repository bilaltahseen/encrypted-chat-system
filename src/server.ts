import express, { Application, Request, Response } from 'express';
import { Server, createServer } from 'http';

import Socket from './socket';

const app: Application = express();
const httpServer: Server = createServer(app);
const port: Number = 3000;

const socket = new Socket();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    socket.create(httpServer);
    socket.handlePrivateMessage();
});


