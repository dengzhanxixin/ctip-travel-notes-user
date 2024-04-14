import React, { useState, useEffect } from "react";
import { Card, Button, InfiniteScroll, Toast } from "antd-mobile";
import Styles from "@/styles/userInfoList.module.scss";
import { useRouter } from "next/router";

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
  const [userInfoList, setUserINfoList] = useState<UserInfo[]>([]); //当前游记用户信息
  const [userInfo, setUserInfo] = useState({
    username: "",
  }); // 当前登录用户信息
  const [followList, setFollowList] = useState<string[]>([]);

  const [hasMore, setHasMore] = useState(true);
  const [PageProp, setPageProp] = useState({
    PageSize: notes.PageSize,
    PageIndex: notes.PageIndex,
    searchInfo: notes.searchInfo,
  });

  // 点击用户卡片，跳转到用户主页（未实现）
  const router = useRouter();

  const handleClick = (name: string) => {
    // router.push(`/travelDetail?id=${id.toString()}`);
  };

  // 获取该用户关注数据
  const fetchfollowList = async (username: string) => {
    try {
      const response = await fetch("/api/getFollows", {
        method: "POST",
        body: JSON.stringify({ username: username }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setFollowList([...followList, ...data.followList]);
    } catch (err) {
      Toast.show("Failed to fetch FollowList!.");
    }
  };

  // 添加/取消关注（复用游记详情的函数）
  const handleLikeAndSave = async (id: number, noteUser: string, username: string, tabType: string, isadd: boolean) => {
    try {
      const response = await fetch("/api/likeAndSave", {
        method: "POST",
        body: JSON.stringify({ id: id, noteUser: noteUser, username: username, tabType: tabType, isadd: isadd }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
    } catch (err) {
      Toast.show("Failed to fetch travel details.");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({
        username: user.username,
      });
      fetchfollowList(user.username);
    }
  }, []);

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
    <>
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
                  shape="rounded"
                  className={followList.includes(item.nickName)? Styles.isFollow:Styles.notFollow}
                  onClick={async () => {
                    if (userInfo.username !== "") {
                      const isFollow = followList.includes(item.nickName);
                      isFollow? setFollowList(followList.filter(it => it !== item.nickName)) : setFollowList([...followList , item.nickName]); 
                      await handleLikeAndSave(-1, item.nickName, userInfo.username, "followUser", !isFollow);
                    } else {
                      router.push("/login");
                    }
                  }}
                >
                  {followList.includes(item.nickName) ? "已关注" : "+ 关注"}
                </Button>
              </div>
            </Card>
          ))}
      </div>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </>
  );
};

export default UserInfoList;
