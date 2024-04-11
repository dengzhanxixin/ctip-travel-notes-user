import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

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
  items: any;
}

interface travelNoteItem {
  id?: number;
  [key: string]: any;
}


//  获取旅游日记数据
export default function handler(req: NextApiRequest, res: NextApiResponse<userInfoResponse>) {
  const payload = req.body as travelNoteFilterPayload;
  const travelDailyData = JSON.parse(fs.readFileSync('data/TravelData.json', "utf8"));

  const userinfos = travelDailyData.map((item:travelNoteItem) => {
    return item.user;
  });

  var filterData;
  // 未搜索则显示全部用户信息
  if (!payload.searchInfo || payload.searchInfo === "") {
    filterData = userinfos;
  } else {
    // 将符合条件的用户信息返回
    filterData = userinfos.filter((item:UserInfo) => payload.searchInfo && item.nickName.includes(payload.searchInfo));
  }

  const startIndex = 5 * ((payload.PageIndex || 1) - 1);
  const endIndex = startIndex + (payload.PageSize || 5);
  console.log(startIndex, endIndex);

  const total = filterData.length;
  const itemData = filterData.slice(startIndex, endIndex);

  // 去重
  const items = Array.from(itemData.reduce((map:any, obj:any) => map.set(obj.nickName, obj), new Map()).values());

  res.status(200).json({ total, items });
}
