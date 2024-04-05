import { NextApiRequest, NextApiResponse } from "next";
import TopicInfo from "@/data/TopicData/TopicInfo.json";



interface topicInfo {
  [key: string]: any;
}

interface topicResponse {
  items: topicInfo[];
}

//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<topicResponse>) {
  const items = TopicInfo;
  res.status(200).json({items});
}
