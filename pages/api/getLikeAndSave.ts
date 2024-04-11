import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

interface LikeAndSaveProp {
  id: number;
  username: string;
}

interface isLikeAndSave {
    [key: string]: any;
}


//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<isLikeAndSave>) {
  const payload = req.body as LikeAndSaveProp;
  const userInfo = JSON.parse(fs.readFileSync('data/user.json', "utf8"));
  const item = userInfo.find((item:any) => item.username === payload.username);
  if(item){
    res.status(200).json({ islike: item.likeNote.includes(payload.id) , isSave: item.saveNote.includes(payload.id), isFllow: item.followUser.includes(payload.username)});  
  }
  else{
    res.status(404).json({ message: "User not found" });
  }
}
