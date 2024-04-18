import React, { useState, useRef,useEffect} from "react";
import { Card, InfiniteScroll} from "antd-mobile";
import Styles from "@/styles/travelWaterfallFlow.module.scss";
import { useRouter } from "next/router";
import WaterFollow from "./WaterFlow";
import Check from "./Check";
import Image from "next/image";


interface UserInfo {
  icon: string; // 头像
  interactionText: string;
  nickName: string; // 昵称
  interactionIcon: string;
}


interface TravelNoteProps  {
  id: number;
  title: string;
  coverImg: string;
  city: string;
  isChecked:number;
  user: UserInfo;
  checkReason: string;
};

interface travelNoteListProps {
    PageIndex: number;
    PageSize: number;
    searchTitle?: string; // 查询标题与搜索词相关的旅游日记
    searchUser?: string; // 查询该用户的旅游日记
    searchCity?: string; // 查询关于该城市的旅游日记
    searchSpot?: string; // 查询关于该景点的旅游日记
    strictSearch?: boolean; // 严格搜索还是模糊搜索
    searchChecked: number; // 游记审核状态
    notChecked?: boolean; // 
    notSubmit?: boolean;
  }

interface Props {
    notes: travelNoteListProps
}


const TravelWaterFlow: React.FC<Props> = ({notes}) => {
  const [travelNoteList, setTravelNoteList] = useState<TravelNoteProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [PageProp, setPageProp] = useState(notes);
  const [count, setCount] = useState(0);
  // const travelNoteList = travelNotes;

  // 点击推荐卡片跳转到详情页
  const router = useRouter();

  // 请求推荐列表数据
  async function fetchTravelNoteList(payload: travelNoteListProps) {
    const response = await fetch("/api/getTravelDaily", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  }

  // 无限加载，当用户页面滚动到底部 threshold (默认为 250px)时调用。
  async function loadMore() {
    setPageProp((val) => ({ ...val, PageIndex: val.PageIndex + 1 }));
    const res = await fetchTravelNoteList(PageProp);

    setTravelNoteList((val) => {
      const filteredItems = res.items.filter(
        (item: TravelNoteProps) => !val.some((v: TravelNoteProps) => v.id === item.id)
      );
      return [...val, ...filteredItems];
    });
    setCount((count) => count + 1);
    setHasMore(res.items.length > 0);
  }
  useEffect(() => {
    loadMore()
  },[])
  

  return (
    <>
    {(PageProp.notChecked || PageProp.notSubmit)?<Check travelNoteList={travelNoteList} />:<WaterFollow travelNoteList={travelNoteList} />}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </>
  );
};

export default TravelWaterFlow;
