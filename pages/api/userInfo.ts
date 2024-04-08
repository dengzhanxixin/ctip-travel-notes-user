import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from 'path';
interface UserInfo {
    username: string; // 昵称
    avatar: string; // 头像
}
interface userInfoResponse {
    items: UserInfo[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // 解析 POST 请求的主体数据
            const userData  = req.body as UserInfo;
            console.log('Received user info:', userData);
            
            // 将用户信息保存到文件中
            const userDataPath = path.join(process.cwd(), 'data', 'user_data', 'userInfo.json');
            const userDataContent = fs.readFileSync(userDataPath, 'utf8');
            const existingUserData: UserInfo[] = JSON.parse(userDataContent);

            // 合并新的用户信息到现有数据中
            const updatedUserData: UserInfo[] = [...existingUserData, userData];

            // 将更新后的用户信息保存到文件中
            fs.writeFileSync(userDataPath, JSON.stringify(updatedUserData), 'utf8');
            console.log('User info saved successfully');
        } catch (error) {
            console.error('Error processing user info:', error);
        }
    } 
}