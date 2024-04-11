import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");



interface topicInfo {
  [key: string]: any;
}

interface topicResponse {
  items: topicInfo[];
}

//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<topicResponse>) {
  const items = JSON.parse(fs.readFileSync("data/TopicData/TopicInfo.json", "utf8"));
  res.status(200).json({items});
}
