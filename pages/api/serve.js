const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 10; // 定义salt的回合数，推荐值


const path = require("path");
// 从 page/api/ 目录向上两级，然后进入 data 目录
const dataPath = path.join(__dirname, "..", "..", "data", "user.json");
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'ctrip_yhr_secret_key'; // 用于JWT加密的密钥，应保持安全
const port = 3001;

app.use(express.json()); // 用于解析JSON的中间件
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const postDataArray = [];
const imgArray = [];

app.post("/api/register", async (req, res) => {
  const { username, password, avatar } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "需要用户名和密码" });
  }

  const users = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "用户名已存在" });
  }

  // 对密码进行加密
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword, // 存储加密后的密码
    avatar,
  };

  users.push(newUser);
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "用户创建成功" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(404).json({ message: "用户名不存在" });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      // 密码匹配，创建Token
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
      // 返回Token和用户信息（不包含密码）
      res.json({ message: "登录成功", token, user: { ...user, password: undefined } });
    } else {
      res.status(401).json({ message: "密码错误" });
    }
  });
});

app.post("/api/post", (req, res) => {
  const postData = req.body; // 接收到的JSON数据
  console.log("Received post data:", postData);
  postDataArray.push(postData);
  console.log("Current post data array:", postDataArray);
  res.json({ message: "Post successful" });
});

app.post("/api/clearHistory", (req, res) => {
  // 清空历史数据数组
  postDataArray.length = 0;
  console.log("History cleared");
  res.json({ message: "History cleared successfully" });
});

app.get("/api/history", (req, res) => {
  // 从数据库中获取历史数据
  res.json(postDataArray);
  // fs.writeFileSync(
  //     `userData.json`,
  //     JSON.stringify(responseData)
  // );
  // console.log('All post data done');
});
app.get("/api/getpost", (req, res) => {
  // 从数据库中获取历史数据
  res.json(postDataArray);
  console.log("One post data:", postDataArray[0]);
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
