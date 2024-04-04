import { useRouter } from "next/router";
import React from "react";
import { NavBar, Swiper, SwiperRef, Card, InfiniteScroll } from "antd-mobile";
import Styles from "@/styles/showResult.module.scss";
import { useState, useRef } from "react";
import Image from "next/image";
import TravelWaterFlow from "@/components/TravelWaterfallFlow";
import UserInfoList from "@/components/UserInfoList";

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

// interface travelNoteListProps {
//   PageIndex: number;
//   PageSize: number;
//   searchTitle?: string; // 查询标题与搜索词相关的旅游日记
//   searchUser?: string; // 查询该用户的旅游日记
//   searchCity?: string; // 查询关于该城市的旅游日记
//   strictSearch?: boolean; // 严格搜索还是模糊搜索
// }

const SearchInfo: React.FC = () => {
  const router = useRouter();
  const info = router.query.info as string;
  const [activeIndex, setActiveIndex] = useState(0); // 当前活动页面的索引
  const travelInfo = { PageSize: 10, PageIndex: 0, searchTitile: info, searchUser: info, searchCity: info, strictSearch: true };
  const userInfo = { PageSize: 10, PageIndex: 0, searchInfo: info };
  const ref = useRef<SwiperRef>(null);
  
  const nameBars = ["游记", "用户"];


  const handleSwipeChange = (index: number) => {
    setActiveIndex(index); // 更新当前活动页面的索引
    ref.current?.swipeTo(index); // 切换页面
  };

  


  const pages = [
    <div>
      <TravelWaterFlow notes={travelInfo} />
    </div>,
    <div>
      <UserInfoList notes={userInfo} />
    </div>,
  ];

  return (
    <>
      <div className={Styles.searchBar}>
        <NavBar onBack={() => router.back()}>{info}</NavBar>
      </div>
      <div className={Styles.nameBar}>
        {nameBars.map((name, index) => (
          <div
            key={index}
            className={index === activeIndex ? Styles.name_active : Styles.name}
            onClick={() => handleSwipeChange(index)}
          >
            {name}
          </div>
        ))}
      </div>
      <div className={Styles.searchContent}>
        <Swiper ref={ref} onIndexChange={setActiveIndex} indicator={() => null}>
          {pages.map((page, index) => (
            <Swiper.Item key={index}>{page}</Swiper.Item>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default SearchInfo;
