import http from 'http';
import express from 'express';
import cors from 'cors';
import {Server} from 'colyseus';
import {monitor} from '@colyseus/monitor';
import TicTacToe from "./rooms/TicTacToe";

const port = Number(process.env.PORT || 5001);
const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
    server
});

// register your room handlers
gameServer.define('tic-tac-toe', TicTacToe);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor());

gameServer.listen(port);
console.log(`listening on ws:localhost:${port}`)
