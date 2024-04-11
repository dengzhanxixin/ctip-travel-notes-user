import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

interface cityPayload {
  cityName: string;
}

interface CityINfo {
  cityName: string;
  cityID: number;
  eName: string;
  photoCount: string;
  coverImage: string;
}

interface travelNoteResponse {
  [key: string]: any;
}

//  获取城市介绍数据
export default function handler(req: NextApiRequest, res: NextApiResponse<travelNoteResponse>) {
  const CityInfoData = JSON.parse(fs.readFileSync("data/CityTravelData/cityInfo.json", "utf8"));
  const payload = req.body as cityPayload;
  const cityinfo = CityInfoData.find((item: CityINfo) => item.cityName === payload.cityName);
  if (cityinfo) {
    res.status(200).json(cityinfo);
  } else {
    res.status(404).json({ message: "City not found" });
  }
}
