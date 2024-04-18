import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

interface spotPayload {
  cityName: string;
  idx: number
}

interface SpotINfo {
  [key:string]: string;
}

interface spotResponse {
  [key: string]: any;
}

//  获取城市介绍数据
export default function handler(req: NextApiRequest, res: NextApiResponse<spotResponse>) {
  const payload = req.body as spotPayload;
  var spotInfoData;
  if(payload.cityName){
    const CityInfoData = JSON.parse(fs.readFileSync(`data/ScenicSpot/${payload.cityName}.json`, "utf8"));
    spotInfoData = CityInfoData[payload.idx];
  }
  if (spotInfoData) {
    res.status(200).json(spotInfoData);
  } else {
    res.status(404).json({ message: "City not found" });
  }
}
