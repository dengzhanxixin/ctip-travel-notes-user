import React, { useState, useRef } from "react";
import { Card, Button, InfiniteScroll } from "antd-mobile";
import Styles from "@/styles/userInfoList.module.scss";
import { useRouter } from "next/router";
import Image from "next/image";

interface UserInfo {
  icon: string; // 头像
  interactionText: string;
  nickName: string; // 昵称
  interactionIcon: string;
}

interface travelNoteListProps {
  PageIndex: number;
  PageSize: number;
  searchInfo: string; // 与搜索词相关的旅游日记
}

interface Props {
  notes: travelNoteListProps;
}

const UserInfoList: React.FC<Props> = ({ notes }) => {
  const [userInfoList, setUserINfoList] = useState<UserInfo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [PageProp, setPageProp] = useState({
    PageSize: notes.PageSize,
    PageIndex: notes.PageIndex,
    searchInfo: notes.searchInfo,
  });

  //   const travelNoteList = travelNotes;

  // 点击用户卡片，跳转到用户主页
  const router = useRouter();

  const handleClick = (name: string) => {
    // router.push(`/travelDetail?id=${id.toString()}`);
  };

  // 请求推荐列表数据
  async function fetchUserList(payload: travelNoteListProps) {
    const response = await fetch("/api/getUserInfo", {
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
    const res = await fetchUserList(PageProp);
    setUserINfoList((val) => {
      const filteredItems = res.items.filter(
        (item: UserInfo) => !val.some((v: UserInfo) => v.nickName === item.nickName)
      );
      return [...val, ...filteredItems];
    });
    setHasMore(res.items.length > 0);
  }

  return (
    <div>
      {userInfoList &&
        userInfoList.map((item) => (
          <Card className={Styles.card} key={item.nickName} onClick={() => handleClick(item.nickName)}>
            <div className={Styles.content}>
              <div className={Styles.userInfo}>
              <img className={Styles.userIcon} src={item.icon} alt={"用户头像"} width={70} height={70} />
              <div className={Styles.userIntroduction}>
                <div className={Styles.userName}>{item.nickName}</div>
                <div className={Styles.userid}>用户id: 666</div>
                <div className={Styles.user}>游记: 10 |粉丝: 10</div>
              </div>
            </div>
            <Button
            shape = "rounded"
            className={Styles.notFollow}
          >
            { "+ 关注"}
          </Button>
            </div>
            
          </Card>
        ))}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
};

export default UserInfoList;
