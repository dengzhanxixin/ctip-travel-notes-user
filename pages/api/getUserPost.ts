import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');

interface UserPost {
    [key: string]: any;
  }
  
  interface UserResponse {
    items: UserPost[];
  }

//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<UserResponse>) {
    const items = JSON.parse(fs.readFileSync('data/user_data/userData.json', "utf8"));
    res.status(200).json({items});
}
