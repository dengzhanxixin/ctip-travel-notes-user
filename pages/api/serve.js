const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const axios = require("axios");
// sha1加密
// const sha1 = require("sha1");

const saltRounds = 10; // 定义salt的回合数，推荐值

const path = require("path");
// 从 page/api/ 目录向上两级，然后进入 data 目录
const dataPath = path.join(__dirname, "..", "..", "data", "user.json");
const jwt = require("jsonwebtoken");
const { createInputFiles } = require("typescript");
const SECRET_KEY = "ctrip_yhr_secret_key"; // 用于JWT加密的密钥，应保持安全
const port = 3001;

app.use(express.json()); // 用于解析JSON的中间件
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const postDataArray = [];
const imgArray = [];

app.post("/api/register", async (req, res) => {
  const { username, password, avatar, likeNote, saveNote, followUser } = req.body;

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
    likeNote,
    saveNote,
    followUser,
  };

  users.push(newUser);
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "用户创建成功" });
});
app.post("/api/avatar", (req, res) => {
  const { username, url } = req.body;
  // console.log(username, url)
  if (url.startsWith('data:image')) {
    const base64Data = url.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const imgPath = path.join('public', 'images', `${username}_avatar.jpg`);

    // 检查是否存在同名文件，如果存在，则删除
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
      console.log(`已删除旧文件：${imgPath}`);
    } else {
      console.log(`不存在旧文件：${imgPath}`);
    }
    // 写入新的图片文件
    fs.writeFileSync(imgPath, buffer);
    console.log('文件写入成功');
  }
  const users = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const userToUpdate = users.find((user) => user.username === username);
  if (userToUpdate) {
    // 更新用户的头像路径
    userToUpdate.avatar = path.join('images',`${username}_avatar.jpg`).replace(/\\/g, '/');
  
    // 将更新后的用户列表写回到 JSON 文件中
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), 'utf8');
    console.log('用户头像路径更新成功！');
    res.json({ success: true, user: userToUpdate });
  } else {
    console.log('未找到需要更新头像的用户！');
  }
})

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

// 微信分享后端接口实现

// 接口配置信息测试
app.get("/api/wxJssdk", (req, res) => {
  let wx = req.query;

  let token = "ctrip_wexinShare";
  let timestamp = wx.timestamp;
  let nonce = wx.nonce;

  // 将token、timestamp、nonce三个参数进行字典排序
  let list = [token, timestamp, nonce].sort();

  // 将三个参数字符串拼接成一个字符串进行sha1加密
  let str = list.join("");
  let result = sha1(str);

  // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (result === wx.signature) {
    res.send(wx.echostr); // 返回微信传来的echostr，表示校验成功，此处不能返回其它
  } else {
    res.send(false);
  }
});

// 微信分享后端接口实现
app.post("/api/wxJssdk/getJssdk", async (req, res) => {
  const grant_type = "client_credential";
  // 测试号
  const appid = "wx7038d3636b5797ed";
  const secret = "bd3dbda5b59c8f6c1057fb9edd163acd";
  console.log(1);

  try {
    const response1 = await axios.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=" + grant_type + "&appid=" + appid + "&secret=" + secret);
    const access_token = response1.data.access_token;
    const response2 = await axios.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi");
    const jsapi_ticket = response2.data.ticket;

    const nonce_str = "123456"; // 随机字符串
    const timestamp = new Date().getTime(); // 时间戳
    const url = req.query.url; // 请求的 URL

    // 构造待加密字符串
    const str = `jsapi_ticket=${jsapi_ticket}&noncestr=${nonce_str}&timestamp=${timestamp}&url=${url}`;

    // 使用 sha1 加密
    const signature = sha1(str);

    res.send({
      appId: appid,
      timestamp: timestamp,
      nonceStr: nonce_str,
      signature: signature,
    });
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).send("Internal Server Error");
  }

});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
