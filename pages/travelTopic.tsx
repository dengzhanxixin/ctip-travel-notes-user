import { useRouter } from "next/router";
import React, {useState, useRef, } from "react";
import { NavBar, Card, InfiniteScroll } from "antd-mobile";
import Image from "next/image";
import Styles from "@/styles/travelTopic.module.scss";

interface UserInfo {
  icon: string; // 头像
  interactionText: string;
  nickName: string; // 昵称
  interactionIcon: string;
}

interface TravelNoteProps {
  id: number;
  title: string;
  coverImg: string;
  city: string;

  user: UserInfo;
}

interface travelNoteListProps {
  PageIndex: number;
  PageSize: number;
  topicId: string;
}

type topicProps = {
    topicId: number;
    topicName: string;
    remark: string;
    [key: string]: any;
  };

const TopicTravelNotes: React.FC = () => {
  const router = useRouter();
  const info = router.query.info as string;
  const [travelNoteList, setTravelNoteList] = useState<TravelNoteProps[]>([]);
  const [topic, setTopic] = useState<topicProps>();
  const [PageProp, setPageProp] = useState({ PageSize: 10, PageIndex: 0, topicId: info });
  const [hasMore, setHasMore] = useState(true);

  // 点击推荐卡片跳转到详情页

  const handleClick = (id: number) => {
    router.push(`/travelDetail?id=${id.toString()}`);
  };

  // 请求推荐列表数据
  async function fetchTravelNoteList(payload: travelNoteListProps) {
    const response = await fetch("/api/getTopicDaily", {
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
    setTopic(res.topic);
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
      <div
        className={Styles.header}
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0)), url(${topic?.image?.url})`,
          backgroundSize: "cover",
        }}
      >
        <NavBar onBack={() => router.back()} />
        <div className={Styles.topicInfo}>
          <div className={Styles.topicName}>
            <span>#{topic?.topicName}</span>
          </div>
          <div className={Styles.heatText}>{topic?.heatText}条游记</div>
          <div className={Styles.remark}>{topic?.remark}</div>
        </div>
      </div>
      <div>
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
      </div>
    </>
  );
};

export default TopicTravelNotes;
