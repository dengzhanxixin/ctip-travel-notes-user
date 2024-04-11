import { Empty, Card, Drawer, Button } from 'antd';
import { CapsuleTabs } from 'antd-mobile'
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
  const [userInfo, setUserInfo] = useState({
    username: "",
    avatar: "", // 这里应该是你的默认头像路径
  });
  
  const DoneInfo = { PageSize: 10, PageIndex: 0, searchUser: userInfo.username, searchChecked:1, strictSearch: true};
  const WaitInfo = { PageSize: 10, PageIndex: 0, searchUser: userInfo.username, searchChecked:1, strictSearch: true, notChecked:true };




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



  return (
    <>

      <div className={style.mypost}>
        <CapsuleTabs defaultActiveKey='1'>
          <CapsuleTabs.Tab title='已发布游记' key='1'>
            {isMyPost ? (
              <TravelWaterFlow notes={DoneInfo} />
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
        </CapsuleTabs>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        </div>
      </div>

    </>
  )
}
export default MyPost