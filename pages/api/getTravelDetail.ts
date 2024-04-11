import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

interface travelNoteItem {
  id?: number;
  [key: string]: any;
}


//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const travelDailyData = JSON.parse(fs.readFileSync('data/TravelData.json', "utf8"));

  switch (req.method) {
    case "GET": 
      if(id === undefined){
        return res.status(400).json({"message": "Id parameter is required"});
      }
      const travelDetail = travelDailyData.find((item:travelNoteItem) => item.id === parseInt(id as string));
      res.json(travelDetail);
      break;
    case '/api/getTravelDetail':
        break;
    default: {
        res.status(404).json({ message: "API route not found"});
        break;
    }
  }
}
