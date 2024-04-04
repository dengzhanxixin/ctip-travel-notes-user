import React, { useState, useRef} from "react";
import { Card, InfiniteScroll} from "antd-mobile";
import Styles from "@/styles/travelWaterfallFlow.module.scss";
import { useRouter } from "next/router";
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

  user: UserInfo;
};

interface travelNoteListProps {
    PageIndex: number;
    PageSize: number;
    searchTitle?: string; // 查询标题与搜索词相关的旅游日记
    searchUser?: string; // 查询该用户的旅游日记
    searchCity?: string; // 查询关于该城市的旅游日记
    strictSearch?: boolean; // 严格搜索还是模糊搜索
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

  const handleClick = (id: number) => {

    router.push(`/travelDetail?id=${id.toString()}`);
  }

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
      <div className={Styles.container}>
        {travelNoteList &&
          travelNoteList.map((item, i) => (
            <div key={item.id} ref={(ref) => (cardRefs.current[i] = ref)}>
              <Card
                onClick={() => handleClick(item.id)}
                className={Styles.travelCard}
                bodyStyle={{ padding: "0" }}
                key={item.id}
              >
                <Image
                  src={item.coverImg}
                  className={Styles.restImg}
                  alt={"旅游图片"}
                  width={180}
                  height={240}
                  onLoad={() => handleSetGridRowEnd(i)}
                />
                <div className={Styles.infoBox}>
                  <div className={Styles.travelPlace}>
                    <img
                      className={Styles.userIcon}
                      src='/images/location.png'
                      alt={"地点"}
                      width={18}
                      height={18}
                    />
                    <span>{item.city}</span>
                  </div>
                  <div className={Styles.travelTitle}>
                    <h3>{item.title}</h3>
                  </div>
                  <div className={Styles.travelUser}>
                    <div className={Styles.userInfo}>
                      <img className={Styles.userIcon} src={item.user.icon} alt={"用户头像"} width={18} height={18} />
                      <span className={Styles.userName}>{item.user.nickName}</span>
                    </div>
                    <div className={Styles.viewInfo}>
                      <img
                        className={Styles.iconSee}
                        src={item.user.interactionIcon}
                        alt={" 浏览数"}
                        width={14}
                        height={14}
                      />
                      <span className={Styles.viewNumber}>{item.user.interactionText}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
      </div>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </>
  );
};

export default TravelWaterFlow;
