import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { Socket } from "socket.io";
import path from "path";

dotenv.config();
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname)));

app.get("/", (request: Request, response: Response) => { 
    response.status(200).sendFile(__dirname + "/index.html");
  }); 

  io.on("connection",(socket:Socket)=>{
    console.log("ユーザーが接続しました")

    socket.on("chat message",(msg)=>{
      console.log(`メッセージ:${msg}`);
      //クライアントサイドにmessageを送り返す
      io.emit("chat message",msg);
    })
  });
  
  server.listen(PORT, () => { 
    console.log("Server running at PORT: ", PORT); 
  }).on("error", (error:Error) => {
    // エラーの処理
    throw new Error(error.message);
  });