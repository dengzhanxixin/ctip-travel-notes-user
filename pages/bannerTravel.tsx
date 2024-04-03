import React, { useState, useRef, useEffect } from "react";
import { Card, InfiniteScroll, SearchBar, NavBar, Button } from "antd-mobile";
import Styles from "@/styles/bannerTravel.module.scss";
import { useRouter } from "next/router";
import Image from "next/image";
import TravelWaterFlow from "@/components/TravelWaterfallFlow";


interface UserInfo {
  icon: string; // 头像
  interactionText: string;
  nickName: string; // 昵称
  interactionIcon: string;
}


export type TravelNoteProps = {
  id: number;
  title: string;
  coverImg: string;
  city: string;

  user: UserInfo;
};


const TravelList: React.FC = () => {
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

 

  return (
    <>
      <div className={Styles.header}>
        <div className={isSticky? Styles.search_fixed:Styles.search}>
          <Button onClick={()=>{router.push("/searchPage")}}>搜索栏</Button>
          {/* <SearchBar
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
          /> */}
        </div>
      </div>
      <TravelWaterFlow notes={PageProp} />
    </>
  );
};

export default TravelList;
