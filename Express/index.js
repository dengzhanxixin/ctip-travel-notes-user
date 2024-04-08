const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10; // 定义salt的回合数，推荐值

const app = express();
const PORT = 5000;
const dataPath = path.join(__dirname, "data", "user.json");


const jwt = require('jsonwebtoken');
const SECRET_KEY = 'ctrip_yhr_secret_key'; // 用于JWT加密的密钥，应保持安全

app.use(cors());
app.use(bodyParser.json());

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
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      // 返回Token和用户信息（不包含密码）
      res.json({ message: "登录成功", token, user: { ...user, password: undefined } });
    } else {
      res.status(401).json({ message: "密码错误" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
