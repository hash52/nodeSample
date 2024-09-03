import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { Socket } from "socket.io";
import path from "path";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT;

const prisma = new PrismaClient();

app.use(express.static(path.join(__dirname)));
//note: スレッド作成時のエラー`request.body as it is undefined express`の回避
app.use(express.json()); // body-parser settings

app.get("/", (request: Request, response: Response) => {
  response.status(200).sendFile(__dirname + "/index.html");
});

app.get("/api/threads", async (request: Request, response: Response) => {
  const threads = await prisma.thread.findMany();
  response.json(threads);
});

app.post("/api/threads", async (request: Request, response: Response) => {
  console.log({ body: request.body });
  const { title, content } = request.body;
  const thread = await prisma.thread.create({
    data: {
      title,
      content,
    },
  });
  response.json(thread);
});

io.on("connection", (socket: Socket) => {
  console.log("ユーザーが接続しました");

  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`user joined room: ${room}`);
  });

  socket.on("chat message", (data) => {
    const { room, msg } = data;
    console.log(`ルーム:${room}｜｜メッセージ:${msg}`);
    //クライアントサイドにmessageを送り返す
    io.to(room).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("ユーザーが切断しました");
  });
});

server
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error: Error) => {
    // エラーの処理
    throw new Error(error.message);
  });
