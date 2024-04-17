import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { NavBar, Swiper, SwiperRef } from "antd-mobile";
import Styles from "@/styles/showResult.module.scss";
import { useState, useRef } from "react";
import TravelWaterFlow from "@/components/TravelWaterFlow";
import UserInfoList from "@/components/UserInfoList";

// 用户信息
interface UserInfo {
  icon: string; // 头像
  interactionText: string;
  nickName: string; // 昵称
  interactionIcon: string;
}

// 旅游日记
export type TravelNoteProps = {
  id: number;
  title: string;
  coverImg: string;
  city: string;

  user: UserInfo;
};

const SearchInfo: React.FC = () => {
  const router = useRouter();
  const info = router.query.info as string;
  const [activeIndex, setActiveIndex] = useState(0); // 当前活动页面的索引
  const travelInfo = {
    PageSize: 10,
    PageIndex: 0,
    searchTitle: info,
    searchUser: info,
    searchCity: info,
    strictSearch: false,
    searchChecked:1
  };
  // 为每个页面设置状态值
  const [isTravel, setIsTravel] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    if (info) { // 只有在激活的页面为0时才设置为true
      if(activeIndex === 0){
        setIsTravel(true);
        setIsUser(false);
      }
      else{
        setIsUser(true);
        setIsTravel(false);
      }
      
    } else {
      setIsTravel(false); // 否则设置为false
      setIsUser(false);
    }
  }, [info, activeIndex]);


  const ref = useRef<SwiperRef>(null);

  const nameBars = ["游记", "用户"];

  const handleSwipeChange = (index: number) => {
    setActiveIndex(index); // 更新当前活动页面的索引
    ref.current?.swipeTo(index); // 切换页面
  };

  // 游记结果和用户结果页面（为每个页面添加状态主要是因为Swiper组件中一个滑动会影响另外一个滑动）
  const pages = [
    <div key={0}>{isTravel && <TravelWaterFlow notes={travelInfo} />}</div>,
    <div key={1}>{isUser && <UserInfoList notes={{ PageSize: 10, PageIndex: 0, searchInfo: info }} />}</div>,
  ];


  return (
    <div className={Styles.container}>
      <NavBar className={Styles.searchBar} onBack={() => router.push("/searchPage")}>
        <div className={Styles.searchInput} onClick={() => router.push("/searchPage")}>{info}</div>
      </NavBar>
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
      <div className={Styles.content}>
        <Swiper ref={ref} onIndexChange={setActiveIndex} indicator={() => null}>
          {pages.map((page, index) => (
            <Swiper.Item key={index}>{page}</Swiper.Item>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SearchInfo;
