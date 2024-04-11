const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
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
app.post("/api/wxJssdk/getJssdk", (req, res) => {
  const grant_type = "client_credential";
  // 测试号
  const appid = "wx7038d3636b5797ed";
  const secret = "bd3dbda5b59c8f6c1057fb9edd163acd";

  request(
    "https://api.weixin.qq.com/cgi-bin/token?grant_type=" + grant_type + "&appid=" + appid + "&secret=" + secret,
    (err, response, body) => {
      let access_token = JSON.parse(body).access_token;

      request(
        "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi",
        (err, response, body) => {
          let jsapi_ticket = JSON.parse(body).ticket;
          let nonce_str = "123456"; // 密钥，字符串任意，可以随机生成
          let timestamp = new Date().getTime(); // 时间戳
          let url = req.query.url; // 使用接口的url链接，不包含#后的内容

          // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
          let str =
            "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + nonce_str + "&timestamp=" + timestamp + "&url=" + url;

          // 用sha1加密
          let signature = sha1(str);

          res.send({
            appId: appid,
            timestamp: timpstamp,
            nonceStr: nonce_str,
            signature: signature,
          });
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
