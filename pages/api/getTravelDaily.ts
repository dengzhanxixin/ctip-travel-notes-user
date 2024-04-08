import { NextApiRequest, NextApiResponse } from "next";
import travelDailyData from "@/data/user_data/userData.json";

interface travelNoteFilterPayload {
  PageIndex: number;
  PageSize: number;
  searchTitle?: string; // 查询标题与搜索词相关的旅游日记
  searchUser?: string; // 查询该用户的旅游日记
  searchCity?: string; // 查询关于该城市的旅游日记
  strictSearch?: boolean; // 严格搜索还是模糊搜索
  // searchContent?: string; // 查询内容与搜索词相关的旅游日记
}

interface travelNoteItem {
  id?: number;
  [key: string]: any;
}

interface travelNoteResponse {
  total: number;
  items: travelNoteItem[];
}

//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<travelNoteResponse>) {
  const payload = req.body as travelNoteFilterPayload;

  var searchData: any[] = [];
  // 没有搜索关键词则显示全部信息
  if (!payload.searchCity && !payload.searchTitle && !payload.searchUser) {
    searchData = travelDailyData;
  } else {
    searchData = travelDailyData.filter((item) =>
      payload.strictSearch
        ? (payload.searchTitle && item.title === payload.searchTitle) ||
          (payload.searchUser && item.user.nickName === payload.searchUser) ||
          (payload.searchCity && item.city === payload.searchCity)
        : (payload.searchTitle && item.title.includes(payload.searchTitle))  ||
          (payload.searchUser && item.user.nickName.includes(payload.searchUser)) ||
          (payload.searchCity && item.city.includes(payload.searchCity))
    );
  }

  const startIndex = 5 * ((payload.PageIndex || 1) - 1);
  const endIndex = startIndex + (payload.PageSize || 5);
  console.log(startIndex, endIndex);

  const total = searchData.length;
  const items = searchData.slice(startIndex, endIndex);
  res.status(200).json({ total, items });
}
