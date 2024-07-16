const express = require("express");
const dotenv = require("dotenv");

// アプリケーションで動作するようにdotenvを設定する
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/", (request, response) => { 
  response.status(200).send("Hello World");
}); 

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // エラーの処理
  throw new Error(error.message);
})