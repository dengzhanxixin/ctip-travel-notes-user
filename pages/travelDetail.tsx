import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { NavBar, Swiper, Toast, Badge, Button, Popup } from "antd-mobile";
import Styles from "@/styles/travelDetail.module.scss";

interface TravelDetailProps {
  [key: string]: any;
}

const TravelDetail: React.FC = () => {
  const [travelDetail, setTravelDetail] = useState<TravelDetailProps | undefined>(undefined);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentState, setCommentState] = useState({
    islike: false,
    likeNum: 0,
    isSave: false,
    saveNum: 0,
    isFollow: false,
  });
  const [isShare, setShareState] = useState(false); 
  const router = useRouter();
  const id = parseInt(router.query.id as string);

  // 获取游记的详细信息
  const fetchTravelNote = async (id: number) => {
    try {
      const params = new URLSearchParams({
        id: id?.toString(),
      });
      const response = await fetch(`/api/getTravelDetail?${params.toString()}`);
      const data = await response.json();
      setTravelDetail(data);
    } catch (err) {
      Toast.show("Failed to fetch travel details.");
    }
  };

  useEffect(() => {
    fetchTravelNote(id);
  }, [id]);

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
            shape = "rounded"
            className={commentState.isFollow ? Styles.isFollow : Styles.notFollow}
            onClick={() => setCommentState({ ...commentState, isFollow: !commentState.isFollow })}
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
        <Button  className={Styles.comment} shape="rounded">浅聊一下吧</Button>
        <div className={Styles.bottomBtn}>
          <Badge
            content={<div className={Styles.customBadge}>{commentState.likeNum}</div>}
            style={{ "--right": "20%", "--top": "20%", backgroundColor: "#ffffff" }}
            className={Styles.customBadge}
          >
            <Button
              className={Styles.barBtn}
              onClick={() => {
                if (commentState.islike === false) {
                  setCommentState({
                    ...commentState,
                    islike: true,
                    likeNum: commentState.likeNum + 1,
                  });
                } else {
                  setCommentState({
                    ...commentState,
                    islike: false,
                    likeNum: commentState.likeNum - 1,
                  });
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
          <Button className={Styles.barBtn} onClick={() => setShareState(true)}>
            <span className="iconfont icon-share" style={{ fontSize: "24px" }} />
          </Button>
          <Popup
            visible={isShare}
            onClose={() => setShareState(false)}
          >
            <NavBar onBack={()=> setShareState(false)}>分享至</NavBar>
            <div>
              {/* 分享到微信 */}
            </div>
          </Popup>
          <Badge
            content={<div className={Styles.customBadge}>{commentState.saveNum}</div>}
            style={{ "--right": "20%", "--top": "20%", backgroundColor: "#ffffff" }}
            className={Styles.customBadge}
          >
             <Button
            className={Styles.barBtn}
            onClick={() => {
              if(commentState.isSave === false) {
                setCommentState({
                 ...commentState,
                  isSave: true,
                  saveNum: commentState.saveNum + 1,
                });
              }
              else {
                setCommentState({
                 ...commentState,
                  isSave: false,
                  saveNum: commentState.saveNum - 1,
                });
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
