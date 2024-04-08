import { NextApiRequest, NextApiResponse } from "next";
import CityInfoData from "@/data/CityTravelData/cityInfo.json";

interface cityPayload {
  cityName: string;
}


interface travelNoteResponse {
    [key: string]: any;
}

//  获取城市介绍数据
export default function handler(req: NextApiRequest, res: NextApiResponse<travelNoteResponse>) {
  const payload = req.body as cityPayload;
  const cityinfo = CityInfoData.find(item => item.cityName === payload.cityName);
  if(cityinfo){
    res.status(200).json(cityinfo);
  }
  else{
    res.status(404).json({ message: "City not found"});
  }

}
