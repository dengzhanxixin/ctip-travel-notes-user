import React, { useState, useRef} from "react";
import { Card, InfiniteScroll} from "antd-mobile";
import Styles from "@/styles/travelWaterfallFlow.module.scss";
import { useRouter } from "next/router";
import WaterFollow from "./WaterFollow";
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
};

interface travelNoteListProps {
    PageIndex: number;
    PageSize: number;
    searchTitle?: string; // 查询标题与搜索词相关的旅游日记
    searchUser?: string; // 查询该用户的旅游日记
    searchCity?: string; // 查询关于该城市的旅游日记
    strictSearch?: boolean; // 严格搜索还是模糊搜索
    searchChecked: number; 
    notChecked?: boolean;
  }

interface Props {
    notes: travelNoteListProps
}


const TravelWaterFlow: React.FC<Props> = ({notes}) => {
  const [travelNoteList, setTravelNoteList] = useState<TravelNoteProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [PageProp, setPageProp] = useState(notes);

//   const travelNoteList = travelNotes;

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
    console.log('PageProp',PageProp);
    setTravelNoteList((val) => {
      const filteredItems = res.items.filter(
        (item: TravelNoteProps) => !val.some((v: TravelNoteProps) => v.id === item.id)
      );
      return [...val, ...filteredItems];
    });
    setHasMore(res.items.length > 0);
  }
  


  // 瀑布流，通过设置grid-row-end属性实现
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const handleSetGridRowEnd = (index: number) => {
    const cardRef = cardRefs.current[index];
    if (!cardRef) return;
    const height = cardRef.offsetHeight;
    // grid-row-end: <line> | <span>;设置元素在网格布局中结束的位置
    cardRef.style.gridRowEnd = `span ${Math.ceil(height)}`;
  };

  return (
    <>
    {PageProp.notChecked?<Check travelNoteList={travelNoteList} />:<WaterFollow travelNoteList={travelNoteList} />}
      
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </>
  );
};

export default TravelWaterFlow;
