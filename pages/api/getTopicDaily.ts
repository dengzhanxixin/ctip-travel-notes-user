import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

interface travelNoteFilterPayload {
  PageIndex: number;
  PageSize: number;
  topicId: string;
}

interface travelNoteItem {
  id?: number;
  [key: string]: any;
}

interface topicProps {
  [key: string]: any;
};

interface travelNoteResponse {
  total: number;
  topic: topicProps;
  items: travelNoteItem[];
}

//  获取专题旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<travelNoteResponse>) {
  const payload = req.body as travelNoteFilterPayload;

  const data = fs.readFileSync('data/TopicData/'+`${payload.topicId}.json`, "utf8");
  const jsondata = JSON.parse(data);
  const topic = jsondata.topic;
  const searchData = jsondata.data;

  const startIndex = 5 * ((payload.PageIndex || 1) - 1);
  const endIndex = startIndex + (payload.PageSize || 5);
  console.log(startIndex, endIndex);

  const total = searchData.length;
  const items = searchData.slice(startIndex, endIndex);
  res.status(200).json({ total, topic, items });
}
