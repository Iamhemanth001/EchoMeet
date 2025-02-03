import dotenv from 'dotenv';

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import express from 'express';
import { createServer } from 'node:http';

import {Server} from 'socket.io';
import mongoose from 'mongoose';

import cors from 'cors';
import { connectToSocket } from './controllers/socketManager.js';

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({ limit: "40kb", extended: true}));

app.get("/", (req, res) => {
  res.send("Server is ready");
});

const start = async () =>{
    const connectionDb = await mongoose.connect(MONGO_URL);
    
    console.log("Database connected", connectionDb.connection.host);
    server.listen(app.get("port"), () => {
        console.log("server is listening to port 8000");
    }); 
}

start();