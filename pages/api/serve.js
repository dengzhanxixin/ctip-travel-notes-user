const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');
const port = 3001;

app.use(express.json()); // 用于解析JSON的中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const postDataArray = [];
const imgArray = [];

app.post('/api/post', (req, res) => {
    const postData = req.body; // 接收到的JSON数据
    console.log('Received post data:', postData);
    postDataArray.push(postData);
    console.log('Current post data array:', postDataArray);
    res.json({ message: 'Post successful' });
});

app.post('/api/clearHistory', (req, res) => {
    // 清空历史数据数组
    postDataArray.length = 0;
    console.log('History cleared');
    res.json({ message: 'History cleared successfully' });
});

app.get('/api/history', (req, res) => {
    // 从数据库中获取历史数据
    res.json(postDataArray);
    // fs.writeFileSync(
    //     `userData.json`,
    //     JSON.stringify(responseData)
    // );
    // console.log('All post data done');
});
app.get('/api/getpost', (req, res) => {
    // 从数据库中获取历史数据
    res.json(postDataArray);
    console.log('One post data:', postDataArray[0]);
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
}); 4