import { NextApiRequest, NextApiResponse } from "next";
import travelDailyData from "../../data/TravelData.json";

interface travelNoteFilterPayload {
  PageIndex?: number;
  PageSize?: number;
  searchInfo?: string; // 与搜索词相关的用户
}

interface UserInfo {
  icon: string; // 头像
  interactionText: number;
  nickName: string; // 昵称
  interactionIcon: string;
}

interface userInfoResponse {
  total: number;
  items: UserInfo[];
}

//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<userInfoResponse>) {
  const payload = req.body as travelNoteFilterPayload;

  const userinfos = travelDailyData.map((item) => {
    return item.user;
  });

  var filterData;
  // 未搜索则显示全部用户信息
  if (!payload.searchInfo || payload.searchInfo === "") {
    filterData = userinfos;
  } else {
    // 将符合条件的用户信息返回
    filterData = userinfos.filter((item) => payload.searchInfo && item.nickName.includes(payload.searchInfo));
  }

  const startIndex = 5 * ((payload.PageIndex || 1) - 1);
  const endIndex = startIndex + (payload.PageSize || 5);
  console.log(startIndex, endIndex);

  const total = filterData.length;
  const itemData = filterData.slice(startIndex, endIndex);

  // 去重
  const items = Array.from(itemData.reduce((map, obj) => map.set(obj.nickName, obj), new Map()).values());

  res.status(200).json({ total, items });
}
