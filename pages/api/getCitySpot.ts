import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

interface cityPayload {
  cityName: string;
}

interface SpotINfo {
  [key:string]: string;
}

interface spotResponse {
  [key: string]: any;
}

//  获取城市介绍数据
export default function handler(req: NextApiRequest, res: NextApiResponse<spotResponse>) {
  const payload = req.body as cityPayload;
  var CityInfoData;
  if(payload.cityName){
    CityInfoData = JSON.parse(fs.readFileSync(`data/ScenicSpot/${payload.cityName}.json`, "utf8"));
  }
  if (CityInfoData) {
    res.status(200).json(CityInfoData);
  } else {
    res.status(500).json({ message: "spot not found" });
  }
}
