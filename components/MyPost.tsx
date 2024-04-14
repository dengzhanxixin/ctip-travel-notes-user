import { Empty, Card, Drawer, Button } from 'antd';
import { Swiper, SwiperRef } from 'antd-mobile'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/router";
import TravelWaterFlow from "@/components/TravelWaterFlow";
import style from "../styles/person.module.scss";

interface TravelInfo {
  PageSize: number;
  PageIndex: number;
  searchUser: string;
  strictSearch: boolean;
  notChecked: boolean;
  notSubmit: boolean;
}
interface TravelNoteProps {
  id: number;
  title: string;
  coverImg: string;
  city: string;
  isChecked: number;
}


const MyPost: React.FC = () => {
  const router = useRouter();
  const [isMyPost, setIsMyPost] = useState(false); // 0表示未发表过游记
  const [activeIndex, setActiveIndex] = useState(0); // 当前活动页面的索引
  const [userInfo, setUserInfo] = useState({
    username: "",
    avatar: "", // 这里应该是你的默认头像路径
  });

  const DoneInfo = { PageSize: 10, PageIndex: 0, searchUser: userInfo.username, searchChecked: 1, strictSearch: true };
  const WaitInfo = { PageSize: 10, PageIndex: 0, searchUser: userInfo.username, searchChecked: 1, strictSearch: true, notChecked: true };
  const notSubmitInfo = { PageSize: 10, PageIndex: 0, searchUser: userInfo.username, searchChecked: 1, strictSearch: true, notSubmit: true };




  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({
        username: user.username,
        avatar: user.avatar,
      });
      setIsMyPost(true);
    }
  }, []);
  const pages = [
    <div key={0}>{isMyPost ? (
      <div style={{ display: 'flex', flexWrap: "wrap", gap: '10px', justifyContent: 'center', paddingTop: '3px', marginRight: '10px' }}>
        <TravelWaterFlow notes={DoneInfo} />
      </div>) : (<Empty description={false} />)}</div>,
      <div key={1}>{isMyPost ? (<TravelWaterFlow notes={WaitInfo} />) : (<Empty description={false} />)}</div>,
      <div key={2}>{isMyPost ? (<TravelWaterFlow notes={notSubmitInfo} />) : (<Empty description={false} />)}</div>,

  ];
  const ref = useRef<SwiperRef>(null);
  const handleSwipeChange = (index: number) => {
    setActiveIndex(index); // 更新当前活动页面的索引
    ref.current?.swipeTo(index); // 切换页面
  };
  const nameBars = ["已发布游记", "未发布游记", "草稿箱"];



  return (
    <>

      <div className={style.mypost}>
      <div className={style.nameBar}>
        {nameBars.map((name, index) => (
          <div
            key={index}
            className={index === activeIndex ? style.name_active : style.name}
            onClick={() => handleSwipeChange(index)}
          >
            {name}
          </div>
        ))}
      </div>
      <Swiper ref={ref} indicator={() => null}>
          {pages.map((page, index) => (
            <Swiper.Item key={index}>{page}</Swiper.Item>
          ))}
        </Swiper>

        {/* <CapsuleTabs style={{ background: 'balck' }} defaultActiveKey='1'>
          <CapsuleTabs.Tab title='已发布游记' key='1'>
            {isMyPost ? (
              <div style={{ display: 'flex', flexWrap: "wrap", gap: '10px', justifyContent: 'center', paddingTop: '3px', marginRight: '10px' }}>
                <TravelWaterFlow notes={DoneInfo} />
              </div>
            ) : (
              <Empty description={false} />
            )}
          </CapsuleTabs.Tab>


          <CapsuleTabs.Tab title='待发布游记' key='2'>
            {isMyPost ? (
              <TravelWaterFlow notes={WaitInfo} />
            ) : (
              <Empty description={false} />
            )}
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title='草稿箱' key='3'>
            {isMyPost ? (
              <TravelWaterFlow notes={notSubmitInfo} />
            ) : (
              <Empty description={false} />
            )}
          </CapsuleTabs.Tab>
        </CapsuleTabs> */}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
        </div>
      </div>

    </>
  )
}
export default MyPost