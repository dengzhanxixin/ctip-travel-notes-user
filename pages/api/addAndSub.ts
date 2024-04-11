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
  var travelInfo = JSON.parse(fs.readFileSync('data/TravelData.json', "utf8"));
  var item = travelInfo.find((item:any) => item.id === payload.id);
  if(item){
    const foundkey = Object.keys(item.user).find(key => key === payload.tabType) as string;

    payload.isadd ? item.user[foundkey]++ : item.user[foundkey]--;

    travelInfo = travelInfo.map((it:any) =>{
        if(it.id === item.id) return item;
        else return it;
    })

    fs.writeFileSync('data/TravelData.json', JSON.stringify(travelInfo), "utf8");
    res.status(200).json({message: "添加成功"});  
  }
  else{
    res.status(404).json({ message: "User not found" });
  }
}
