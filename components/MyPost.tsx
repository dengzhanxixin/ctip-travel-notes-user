import { Empty, Card, Drawer, Button } from 'antd';
import { CapsuleTabs } from 'antd-mobile'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/router";
import TravelWaterFlow from "@/components/TravelWaterfallFlow";

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
  const contentRef = useRef<HTMLDivElement>(null); // 创建 ref
  const [isMyPost, setIsMyPost] = useState(false); // 0表示未发表过游记
  const [publishedNotes, setPublishedNotes] = useState<TravelNoteProps[]>([]);
  const [unpublishedNotes, setUnpublishedNotes] = useState<TravelNoteProps[]>([]);
  const [userInfo, setUserInfo] = useState({
    username: "",
    avatar: "", // 这里应该是你的默认头像路径
  });
  
  const DoneInfo = { PageSize: 10, PageIndex: 0, searchUser: userInfo.username, searchChecked:1, strictSearch: true};
  const WaitInfo = { PageSize: 10, PageIndex: 0, searchUser: userInfo.username, searchChecked:1, strictSearch: true, notChecked:true };

  const [ishidden, setIsHidden] = useState(false);

  const handleScroll = () => {
    const offset = contentRef.current?.scrollTop; // 获取滚动位置
    if (offset && offset > 160) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  };


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({
        username: user.username,
        avatar: user.avatar,
      });
    }
    setIsMyPost(!userInfo.username)
    contentRef.current?.addEventListener("scroll", handleScroll); // 添加滚动事件监听器

    return () => {
      contentRef.current?.removeEventListener("scroll", handleScroll); // 移除滚动事件监听器
    };

  }, []);



  return (
    <>

      <div>
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