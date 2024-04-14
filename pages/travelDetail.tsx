import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { NavBar, Swiper, Toast, Badge, Button, Popup } from "antd-mobile";
import Image from "next/image";
import Styles from "@/styles/travelDetail.module.scss";
import wx from "weixin-js-sdk";
import axios from "axios";

interface TravelDetailProps {
  [key: string]: any;
}

const TravelDetail: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
  });
  const [travelDetail, setTravelDetail] = useState<TravelDetailProps | undefined>(undefined);
  const [commentState, setCommentState] = useState({
    islike: false,
    isSave: false,
    isFollow: false,
  });
  const [commentNum, setCommentNum] = useState({
    likeCount: 0,
    saveNum: 0,
    shareCount: 0,
  });
  const [isShare, setShareState] = useState(false);
  const router = useRouter();
  const id = parseInt(router.query.id as string);

  const shareBtns = [
    {
      text: "微信",
      icon: "iconfont icon-weixin",
      onClick: () => handleShareToWechat(),
    },
    {
      text: "朋友圈",
      icon: "iconfont icon-pengyouquan",
    },
    {
      text: "QQ",
      icon: "iconfont icon-QQ",
    },
    {
      text: "QQ空间",
      icon: "iconfont icon-QQkongjian",
    },
    {
      text: "微博",
      icon: "iconfont icon-xinlangweibo",
    },
  ];

  // 获取游记的详细信息
  const fetchTravelNote = async (id: number) => {
    try {
      const params = new URLSearchParams({
        id: id?.toString(),
      });
      const response = await fetch(`/api/getTravelDetail?${params.toString()}`);
      const data = await response.json();
      setTravelDetail(data);
      setCommentNum({
        ...commentState,
        likeCount: data.user.likeCount,
        saveNum: data.user.commentCount,
        shareCount: data.user.shareCount,
      });
    } catch (err) {
      Toast.show("Failed to fetch travel details.");
    }
  };

  // 获取该游记是否被点赞和收藏
  const fetchLikeAndSave = async (id: number, noteUser: string, username: string) => {
    try {
      const response = await fetch("/api/getLikeAndSave", {
        method: "POST",
        body: JSON.stringify({ id: id, noteUser: noteUser, username: username }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCommentState({
        ...commentState,
        islike: data.islike,
        isSave: data.isSave,
        isFollow: data.isFollow,
      });
    } catch (err) {
      Toast.show("Failed to fetch travel details.");
    }
  };

  // 增加或消除用户方的点赞、收藏数据
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

  // 增加游记数据里的点赞、收藏数
  const handleAddAndSub = async (id: number, tabType: string, isadd: boolean) => {
    try {
      const response = await fetch("/api/addAndSub", {
        method: "POST",
        body: JSON.stringify({ id: id, tabType: tabType, isadd: isadd }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
    } catch (err) {
      Toast.show("Failed to fetch travel details.");
    }
  };

  // 分享游记信息到微信
  const handleShareToWechat = () => {
    if (!wx) {
      // 如果微信 JSSDK 未加载完成，则给出提示
      Toast.show("无法分享，请稍后重试。");
      return;
    }
    if (typeof window !== 'undefined') {
       // 获取当前页面URL并进行编码
      const currentUrl = encodeURIComponent(window.location.href);
      // wx分享接口初始化
      axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/api/wxJssdk`, { url: currentUrl }).then((response) => {
        var data = response.data;
        wx.config({
          debug: false, // 调试模式
          appId: data.appId, // 公众号唯一标识
          timestamp: data.timestamp, // 时间戳
          nonceStr: data.nonceStr, // 随机串
          signature: data.signature, // 签名
          jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"], // js接口列表
        });
        wx.ready(() => {
          wx.updateAppMessageShareData({
            title: travelDetail?.title,
            desc: travelDetail?.content,
            link: window.location.href,
            imgUrl: travelDetail?.images[0],
            success: () => {
              Toast.show("分享成功！");
            },
            cancel: () => {
              Toast.show("分享取消！");
            },
          });
        });

        wx.error(() => {
          Toast.show("分享失败！");
        });
      });
    } else{
      console.log("window为undefined")
    }
  };

  useEffect(() => {
      // 获取游记详情
    fetchTravelNote(id);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({
        username: user.username,
      });
    }
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (travelDetail && storedUser) {
      fetchLikeAndSave(id,travelDetail?.user.nickName,userInfo.username);
      }
      
    }, [travelDetail]);
  

  return (
    <div className={Styles.container}>
      <NavBar
        className={Styles.navBar}
        left={
          <div className={Styles.barUser}>
            <img className={Styles.userIcon} src={travelDetail?.user.icon} alt={"用户头像"} width={40} height={40} />
            <span>{travelDetail?.user.nickName}</span>
          </div>
        }
        right={
          <Button
            shape="rounded"
            className={commentState.isFollow ? Styles.isFollow : Styles.notFollow}
            onClick={async () => {
              if (userInfo.username !== "") {
                await handleLikeAndSave(id, travelDetail?.user.nickName,userInfo.username, "followUser", !commentState.isFollow);
                setCommentState({ ...commentState, isFollow: !commentState.isFollow });
              } else {
                router.push("/login");
              }
            }}
          >
            {commentState.isFollow ? "已关注" : "+ 关注"}
          </Button>
        }
        onBack={() => router.back()}
      />
      {travelDetail && (
        <div className={Styles.content}>
          <Swiper
            indicatorProps={{
              color: "white",
              style: {
                marginBottom: "10px",
              },
            }}
          >
            {travelDetail.images.map((item: any, index: number) => (
              <Swiper.Item key={index}>
                <img src={item.url} alt={`旅游图片 ${index}`} className={Styles.imgSwiper} />
              </Swiper.Item>
            ))}
          </Swiper>
          <div className={Styles.contentText}>
            <span className={Styles.travelTitle}>{travelDetail.title}</span>
            {/* <TextArea autoSize readOnly value={travelDetail.content} /> */}
            <div className={Styles.travelText}>{travelDetail.content}</div>

            <div className={Styles.briefTime}>
              <span>{travelDetail.publishDisplayTime}发布</span>
              <span className={Styles.ip}>IP:{travelDetail.city}</span>
              <span>拍摄于{travelDetail.shootDisplayTime}</span>
            </div>
          </div>
        </div>
      )}
      <div className={Styles.bottomBar}>
        <Button className={Styles.comment} shape="rounded">
          浅聊一下吧
        </Button>
        <div className={Styles.bottomBtn}>
          <Badge
            content={
              <div className={Styles.customBadge}>
                {commentNum.likeCount > 1000 ? Math.ceil(commentNum.likeCount / 100) + "k" : commentNum.likeCount}
              </div>
            }
            style={{ "--right": "20%", "--top": "20%", backgroundColor: "#ffffff" }}
            className={Styles.customBadge}
          >
            <Button
              className={Styles.barBtn}
              onClick={async () => {
                if (userInfo.username !== "") {
                  const newLikeCount = commentState.islike ? commentNum.likeCount - 1 : commentNum.likeCount + 1;
                  await handleLikeAndSave(id, travelDetail?.user.nickName, userInfo.username, "likeNote", !commentState.islike); // 反转点赞状态
                  await handleAddAndSub(id, "likeCount", !commentState.islike);
                  setCommentState({
                    ...commentState,
                    islike: !commentState.islike, // 反转点赞状态
                  });
                  setCommentNum({
                    ...commentNum,
                    likeCount: newLikeCount, // 更新点赞数
                  });
                } else {
                  router.push("/login");
                }
              }}
            >
              <span
                className={commentState.islike ? "iconfont icon-like-fill" : "iconfont icon-like1"}
                style={commentState.islike ? { fontSize: "24px", color: "red" } : { fontSize: "24px" }}
              />
            </Button>
          </Badge>
          <Button className={Styles.barBtn}>
            <span className="iconfont icon-comment" style={{ fontSize: "24px" }} />
          </Button>
          <Badge
            content={
              <div className={Styles.customBadge}>
                {commentNum.shareCount > 1000 ? Math.ceil(commentNum.shareCount / 100) + "k" : commentNum.shareCount}
              </div>
            }
            style={{ "--right": "20%", "--top": "20%", backgroundColor: "#ffffff" }}
            className={Styles.customBadge}
          >
            <Button className={Styles.barBtn} onClick={() => setShareState(true)}>
              <span className="iconfont icon-share" style={{ fontSize: "24px" }} />
            </Button>
          </Badge>
          <Popup visible={isShare} onClose={() => setShareState(false)}>
            <NavBar onBack={() => setShareState(false)}>分享至</NavBar>
            <ul className={Styles.shareSofts}>
              {shareBtns.map((share, index) => {
                return (
                  <li className={Styles.shareAPP} onClick={share.onClick} key={index}>
                    <span className={share.icon} style={{ fontSize: "45px" }} />
                    <div className={Styles.appName}>{share.text}</div>
                  </li>
                );
              })}
            </ul>
          </Popup>
          <Badge
            content={
              <div className={Styles.customBadge}>
                {commentNum.saveNum > 1000 ? Math.ceil(commentNum.saveNum / 100) + "k" : commentNum.saveNum}
              </div>
            }
            style={{ "--right": "20%", "--top": "20%", backgroundColor: "#ffffff" }}
            className={Styles.customBadge}
          >
            <Button
              className={Styles.barBtn}
              onClick={async () => {
                if (userInfo.username !== "") {
                  const newSaveNum = commentState.isSave ? commentNum.saveNum - 1 : commentNum.saveNum + 1;
                  await handleLikeAndSave(id, travelDetail?.user.nickName, userInfo.username, "saveNote", !commentState.isSave); // 反转保存状态
                  await handleAddAndSub(id, "commentCount", !commentState.isSave);
                  setCommentState({
                    ...commentState,
                    isSave: !commentState.isSave, // 反转保存状态
                  });
                  setCommentNum({
                    ...commentNum,
                    saveNum: newSaveNum, // 更新保存数
                  });
                } else {
                  router.push("/login");
                }
              }}
            >
              <span
                className={commentState.isSave ? "iconfont icon-like" : "iconfont icon-like2"}
                style={commentState.isSave ? { fontSize: "24px", color: "red" } : { fontSize: "24px" }}
              ></span>
            </Button>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TravelDetail;
