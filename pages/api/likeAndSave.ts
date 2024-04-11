import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

interface LikeAndSaveProp {
    [key: string]: any;
}

interface isLikeAndSave {
    [key: string]: any;
}


//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<isLikeAndSave>) {
  const payload = req.body as LikeAndSaveProp;
  var userInfo = JSON.parse(fs.readFileSync('data/user.json', "utf8"));
  var item = userInfo.find((item:any) => item.username === payload.username);
  if(item){
    const foundkey = Object.keys(item).find(key => key === payload.tabType) as string;
    if(foundkey!=="followUser"){
        payload.isadd ? item[foundkey].push(payload.id) : item[foundkey] = item[foundkey].filter((item:any) => item !== payload.id);
    }
    else {
        payload.isadd ? item[foundkey].push(payload.username) : item[foundkey] = item[foundkey].filter((item:any) => item !== payload.username);
    }

    userInfo = userInfo.map((it:any) =>{
        if(it.name = item.name) return item;
        else return it;
    })

    fs.writeFileSync('data/user.json', JSON.stringify(userInfo), "utf8");
    res.status(200).json({message: "添加成功"});  
  }
  else{
    res.status(404).json({ message: "User not found" });
  }
}
