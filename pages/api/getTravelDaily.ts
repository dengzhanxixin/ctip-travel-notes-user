import { NextApiRequest, NextApiResponse } from "next";
import travelDailyData from "../../data/totalTravelData.json";

interface travelNoteFilterPayload {
  PageIndex?: number;
  PageSize?: number;
  searchInfo?: string; // 与搜索词相关的旅游日记
}

interface travelNoteItem {
  id?: string;
  [key: string]: any;
}

interface travelNoteResponse {
  total: number;
  items: travelNoteItem[];
}

//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<travelNoteResponse>) {
  const payload = req.body as travelNoteFilterPayload;

  var filterDate;
  // 未搜索则显示全部信息
  if (!payload.searchInfo || payload.searchInfo === "") {
    filterDate = travelDailyData;
  } else {
    // 将游记标题含有的游记
    filterDate = travelDailyData.filter(
      (items) =>
        // (payload.searchInfo && items.user.nickname.includes(payload.searchInfo)) ||
        (payload.searchInfo && items.title.includes(payload.searchInfo))
    );
  }
  const startIndex = 5 * ((payload.PageIndex || 1) - 1);
  const endIndex = startIndex + (payload.PageSize || 5);
  console.log(startIndex, endIndex);

  const total = filterDate.length;
  const items = filterDate.slice(startIndex, endIndex);
  res.status(200).json({ total, items });
}
