import { NextApiRequest, NextApiResponse } from "next";
import travelDailyData from "@/data/user_data/userData.json";



//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log("id:",id);

  switch (req.method) {
    case "GET": 
      if(id === undefined){
        return res.status(400).json({"message": "Id parameter is required"});
      }
      const travelDetail = travelDailyData.find((item) => item.id === parseInt(id as string));
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
