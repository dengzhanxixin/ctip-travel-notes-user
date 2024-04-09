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
}
interface TravelNoteProps {
  id: number;
  title: string;
  coverImg: string;
  city: string;
  isChecked: number;
}

interface Props {
  notes: TravelNoteProps[];
}
const MyPost: React.FC = () => {
  const router = useRouter();
  const info = router.query.info as string;
  const contentRef = useRef<HTMLDivElement>(null); // 创建 ref
  const [isMyPost, setIsMyPost] = useState(0); // 0表示未发表过游记
  const [publishedNotes, setPublishedNotes] = useState<TravelNoteProps[]>([]);
  const [unpublishedNotes, setUnpublishedNotes] = useState<TravelNoteProps[]>([]);
  const [userInfo, setUserInfo] = useState([]);
  // const travelInfo = { PageSize: 0, PageIndex: 0, searchUser: info, strictSearch: true };
  const travelInfo: TravelInfo[] = [
    { PageSize: 10, PageIndex: 0, searchUser: info, strictSearch: true },
    { PageSize: 10, PageIndex: 0, searchUser: info, strictSearch: false },
    // 其他旅行信息对象
  ];
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

    const fetchData = async () => {
      const response = await fetch("/api/getUserPost", {
        method: "POST",
        body: JSON.stringify({ username: info }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUserInfo(data);
      setIsMyPost(data.items.length);
      if (data && data.items) {
        const published = data.items.filter((note: TravelNoteProps) => note.isChecked === 1);
        const unpublished = data.items.filter((note: TravelNoteProps) => note.isChecked !== 1);
        setPublishedNotes(published);
        setUnpublishedNotes(unpublished);
        console.log(published);
      }
    };
    fetchData();

    contentRef.current?.addEventListener("scroll", handleScroll); // 添加滚动事件监听器

    return () => {
      contentRef.current?.removeEventListener("scroll", handleScroll); // 移除滚动事件监听器
    };
  }, [info]);



  return (
    <>

      <div>
        <CapsuleTabs defaultActiveKey='1'>
          <CapsuleTabs.Tab title='已发布游记' key='1'>
            {isMyPost === 0 ? (
              <Empty description={false} />
            ) : (
              publishedNotes.length === 0 ? (
                <Empty description={false} />
              ) : (
                <TravelWaterFlow notes={publishedNotes} />
              )
            )}
          </CapsuleTabs.Tab>


          <CapsuleTabs.Tab title='待发布游记' key='2'>
          {unpublishedNotes.length === 0 ? (
            <Empty description={false} />
          ) : (<TravelWaterFlow notes={unpublishedNotes} />)}
          </CapsuleTabs.Tab>
        </CapsuleTabs>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
        </div>
      </div>

    </>
  )
}
export default MyPost