import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

interface followProp {
  username: string;
}

interface isfolloList {
    [key: string]: any;
}


//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<isfolloList>) {
  const payload = req.body as followProp;
  const userInfo = JSON.parse(fs.readFileSync('data/user.json', "utf8"));
  const item = userInfo.find((item:any) => item.username === payload.username);
  if(item){
    res.status(200).json({ followList: item.followUser});  
  }
  else{
    res.status(404).json({ message: "User not found" });
  }
}
