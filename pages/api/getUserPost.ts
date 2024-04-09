import { NextApiRequest, NextApiResponse } from "next";
import UserPostInfo from "../../data/user_data/userData.json";

interface UserPost {
    [key: string]: any;
  }
  
  interface UserResponse {
    items: UserPost[];
  }

//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<UserResponse>) {
    const items = UserPostInfo;
    res.status(200).json({items});
}
