import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from 'path';

interface LikeResponse {
    username: string;
    likeNote: string[];
    saveNote: string[];
    followUser: string[];
}


export default function handler(req: NextApiRequest, res: NextApiResponse<LikeResponse>) {
    const requestData = req.body;
    if (req.method === 'POST') {
        const { username } = requestData;
        console.log('username',username);
        const userData = JSON.parse(fs.readFileSync('data/user.json', 'utf8'));

        const searchData = userData.find((item: any) => username === item.username);

        if (searchData) {
            // 如果找到用户数据，则返回点赞、收藏和关注数据
            res.status(200).json(searchData);
        }

    }



}