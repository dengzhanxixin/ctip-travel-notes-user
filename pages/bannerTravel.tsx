import React, { useState, useRef, useEffect } from "react";
import { Card, InfiniteScroll, SearchBar, NavBar } from "antd-mobile";
import Styles from "@/styles/bannerTravel.module.scss";
import { useRouter } from "next/router";
import Image from "next/image";

interface ImageInfo {
  url: string;
  width: string;
  height: string;
}
interface ImagesDictionary {
  [key: string]: ImageInfo;
}

interface UserInfo {
  icon: string; // 头像
  interactionText: string;
  nickname: string; // 昵称
  interactionIcon: string;
}

interface CityInfo {
  city: string;
  locationicon: string;
}

export type TravelNoteProps = {
  id: string;
  height: number;
  title: string;
  img: ImagesDictionary;
  img_Intrinsic: string; // 瀑布流展示的图
  cityname: string;
  user: UserInfo;
  traffic: CityInfo;
};

interface travelNoteListProps {
  PageIndex: number;
  PageSize: number;
  searchInfo: string; // 与搜索词相关的旅游日记
}

const TravelList: React.FC = () => {
  const [travelNoteList, setTravelNoteList] = useState<TravelNoteProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [PageProp, setPageProp] = useState({ PageSize: 10, PageIndex: 0, searchInfo: "" });
  const [isSticky, setIsSticky] = useState(false);

  // 点击推荐卡片跳转到详情页
  const router = useRouter();

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 60) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const updateSearchInfo = async (value: string) => {
    setPageProp({ PageSize: 10, PageIndex: 0, searchInfo: value }); // 搜索时重置PageIndex
    setTravelNoteList([]); // 清空当前列表，以便加载新的搜索结果
    const res = await fetchTravelNoteList({ PageSize: 10, PageIndex: 0, searchInfo: value }); // 立即搜索
    setTravelNoteList([...res.items]);
    setHasMore(res.items.length > 0);
  };

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
      <div className={Styles.header}>
        <div className={isSticky? Styles.search_fixed:Styles.search}>
          <SearchBar
            placeholder="游记标题 用户昵称"
            style={{
              "--border-radius": "100px",
              "--background": "#fff",
              "--height": "32px",
              "--padding-left": "12px",
            }}
            onSearch={(value) => {
              updateSearchInfo(value);
            }}
          />
        </div>
      </div>

      <div className={Styles.container}>
        {travelNoteList &&
          travelNoteList.map((item, i) => (
            <div key={item.id} ref={(ref) => (cardRefs.current[i] = ref)}>
              <Card
                // onClick={() => handleClick(item.restaurantId)}
                className={Styles.travelCard}
                bodyStyle={{ padding: "0" }}
                key={item.id}
              >
                <Image
                  src={item.img_Intrinsic}
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
                      src={item.traffic.locationicon}
                      alt={"地点"}
                      width={18}
                      height={18}
                    />
                    <span>{item.traffic.city}</span>
                  </div>
                  <div className={Styles.travelTitle}>
                    <h3>{item.title}</h3>
                  </div>
                  <div className={Styles.travelUser}>
                    <div className={Styles.userInfo}>
                      <img className={Styles.userIcon} src={item.user.icon} alt={"用户头像"} width={18} height={18} />
                      <span className={Styles.userName}>{item.user.nickname}</span>
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
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </div>
    </>
  );
};

export default TravelList;
