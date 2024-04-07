import { Empty, Card, Drawer, Button } from 'antd';
import { CapsuleTabs } from 'antd-mobile'
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";


const MyPost = () => {
    const router = useRouter();
    const [isMyPost, setIsMyPost] = useState(0); // 0表示未发表过游记
    const [postData, setPostData] = useState<any>(); // State to hold the fetched post data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/allPost');
                const data = await response.json();
                console.log(data);
                console.log('Data upload done');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {isMyPost === 1 ? (
                <Empty description={false} />
            ) : (
                <div>
                    <CapsuleTabs defaultActiveKey='1'>
                        <CapsuleTabs.Tab title='已发布游记' key='1'>
                            <p>title:{ }</p>
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