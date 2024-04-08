import { Empty, Card, Drawer, Button } from 'antd';
import { CapsuleTabs } from 'antd-mobile'
import { useState, useEffect,useRef } from 'react';
import { useRouter } from "next/router";
import TravelWaterFlow from "@/components/TravelWaterfallFlow";


const MyPost : React.FC = () => {
    const router = useRouter();
    const info = router.query.info as string;
    const contentRef = useRef<HTMLDivElement>(null); // 创建 ref
    const [isMyPost, setIsMyPost] = useState(0); // 0表示未发表过游记
    const [userInfo, setUserInfo] = useState([]);
    const travelInfo = { PageSize: 0, PageIndex: 0, searchUser: info, strictSearch: true };
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
          const response = await fetch("/api/getUerPost", {
            method: "POST",
            body: JSON.stringify({ username: info }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log(data);
          setUserInfo(data);
        };
        fetchData();
    
        contentRef.current?.addEventListener("scroll", handleScroll); // 添加滚动事件监听器
    
        return () => {
          contentRef.current?.removeEventListener("scroll", handleScroll); // 移除滚动事件监听器
        };
      }, [info]);


    return (
        <>
            {isMyPost === 1 ? (
                <Empty description={false} />
            ) : (
                <div>
                    <CapsuleTabs defaultActiveKey='1'>
                        <CapsuleTabs.Tab title='已发布游记' key='1'>
                        <TravelWaterFlow notes={travelInfo} />
                        </CapsuleTabs.Tab>
                        <CapsuleTabs.Tab title='待发布游记' key='2'>
                            <Empty description={false} />
                        </CapsuleTabs.Tab>
                    </CapsuleTabs>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {/* <button style={{ width: '90%' }} onClick={handleChange}>查看所有游记</button> */}

                    </div>
                </div>
            )}
        </>
    )
}
export default MyPost