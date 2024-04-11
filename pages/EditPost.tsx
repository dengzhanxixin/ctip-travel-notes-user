import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Divider } from 'antd';
import { NavBar, TextArea, Card, Popup, Button, CheckList, Cascader, Toast } from "antd-mobile";
import { EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import AddImage from "../components/AddImage";
import styles from "../styles/post.module.scss";
import { options } from '../data/province'

const items = ['公开可见', '仅自己可见']
interface EditorDetailProps {
    [key: string]: any;
}
interface Image{
    url: string;
    width: number;
    height: number;
}
const { Title } = Typography;
export default function AddPost() {
    const router = useRouter();
    const id = parseInt(router.query.id as string);
    const [visible2, setVisible2] = useState(false)
    const [selected, setSelected] = useState('公开可见')
    const [selectedCity, setSelectedCity] = useState('');
    const [tempImages, setTempImages] = useState<Image[]>([]);
    const[isReady, setIsReady] = useState(false);

    const [EditorData, setEditorData] = useState<EditorDetailProps>();
    const fetchTravelNote = async (id: number) => {
        try {
            const params = new URLSearchParams({
                id: id?.toString(),
            });
            const response = await fetch(`/api/getTravelDetail?${params.toString()}`);
            // setEditorData(prevEditorData => ({
            //     ...prevEditorData,
            //     id: params.toString(),
            // }));
            if (!response.ok) {
                throw new Error("Failed to fetch travel details: " + response.statusText);
            }
            const data = await response.json();
            if (data) {
                setEditorData(prevEditorData => ({
                    ...prevEditorData,
                    id: params.toString(),
                    ...data, // 将返回的数据合并到 EditorData 中
                }));
            }
        } catch (err) {
            console.log(err)
            Toast.show("Failed to fetch travel details.");
        }
    };
    useEffect(() => {
        fetchTravelNote(id);
    }, [id]);

    
    const handleThumbUrlsChange = (thumbUrls: string[]) => {
        const updatedTempImages = thumbUrls.map((url, index) => ({
            url: url,
            width:  0,
            height:  0
        }));
        setTempImages(updatedTempImages);
        console.log('tempImages', tempImages)
    };
    
    const handleSubmit = () => {
        if (!(EditorData && EditorData.title) || !(EditorData && EditorData.content)) {
            Toast.show('标题和正文不能为空！');
            return; // 不执行提交操作
        }
    
        // 更新 EditorData
        const publishDisplayTime = new Date().toISOString();
        setEditorData({
            ...EditorData,
            images: tempImages,
            publishDisplayTime: publishDisplayTime,
        });
        setIsReady(true);
    };
    
    // 监听 EditorData 的变化，一旦变化，执行 POST 请求
    useEffect(() => {
        if (isReady) {
            try {
                const response = fetch(`/api/editorPost`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(EditorData)
                });
                Toast.show('发布成功！');
                router.push('/person');
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }
    }, [EditorData, isReady]);
    
    const handleInputChange = (name: string, value: string) => {
        setEditorData(prevEditorData => ({
            ...prevEditorData,
            [name]: value
        }));
    };
    const filteredItems = useMemo(() => {
        return items
    }, items)
    const handleAddLocation = async () => {
        const value = await Cascader.prompt({
            options,
            title: '选择地址',
        });
        if (value) {
            const selectedCity = value.join('-'); // 将选择的地址拼接成一个字符串
            setSelectedCity(selectedCity); // 更新组件中的状态
            // 更新表单数据中的 city 字段
            setEditorData(prevEditorData => ({
                ...prevEditorData,
                city: selectedCity,
            }));
            Toast.show(`你选择了 ${selectedCity}`);
        } else {
            Toast.show('你没有进行选择');
        }
    };
    // console.log('EditorData.images', EditorData&&EditorData.images.url)  



    return (
        <>
            <div style={{ width: "100%", height: "140px" }}>
                <div style={{ padding: '10px 0 0 30px', width: '390px' }}>
                    {EditorData && <AddImage ImgList={EditorData.images} onThumbUrlsChange={handleThumbUrlsChange} />}

                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                <TextArea
                    name='title'
                    value={EditorData && EditorData.title}
                    style={{ width: '90%', height: '10px', fontSize: '20px', fontWeight: 'bold' }}
                    onChange={(value) => { handleInputChange('title', value) }}
                    placeholder="请填写你的游记标题～"
                    showCount
                    maxLength={30}
                    autoSize />
            </div>
            <Divider dashed />
            {/* 编写正文 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20px', height: '200px', marginBottom: '10px' }}>
                <TextArea
                    name='content'
                    style={{ width: '90%', height: '100%' }}
                    value={EditorData && EditorData.content}
                    onChange={(value) => { handleInputChange('content', value) }}
                    placeholder="请在这里输入你的游记正文吧～"
                    showCount
                    maxLength={300}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                />
            </div>
            <div>
                <Card style={{ height: 200, marginBottom: '20px', lineHeight: '20px' }}>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', paddingRight: '40px' }}>
                            <EnvironmentOutlined style={{ fontSize: '32px', width: '30px', padding: '0 10px 10px 0' }} />
                            <Title level={4} style={{ display: 'flex', alignItems: 'center' }}>
                                <div onClick={handleAddLocation}>添加地点</div>
                            </Title>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'right' }}>{EditorData && EditorData.city}</div>

                    </div>


                    <br />
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', paddingRight: '40px' }}>
                            <TeamOutlined style={{ fontSize: '32px', width: '30px', padding: '0 10px 10px 0' }} /> <Title level={4} style={{ display: 'flex', alignItems: 'center' }}>
                                <div onClick={() => {
                                    setVisible2(true)
                                }}>公开选项</div>
                            </Title>

                            <Popup
                                visible={visible2}
                                onMaskClick={() => {
                                    setVisible2(false)
                                }}
                                destroyOnClose
                            >
                                <div className={styles.searchBarContainer}>
                                </div>
                                <div className={styles.checkListContainer}>
                                    <CheckList
                                        className={styles.myCheckList}
                                        defaultValue={[selected]}
                                        onChange={val => {
                                            setSelected(val[0] as string)
                                            setVisible2(false)
                                        }}
                                    >
                                        {filteredItems.map(item => (
                                            <CheckList.Item key={item} value={item}>
                                                {item}
                                            </CheckList.Item>
                                        ))}
                                    </CheckList>
                                </div>

                            </Popup>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'right' }}>{selected}</div>

                    </div>



                    <br />
                    <div style={{ display: 'flex', paddingRight: '40px' }}>
                        <EnvironmentOutlined style={{ fontSize: '32px', width: '30px', padding: '0 10px 10px 0' }} /> <Title level={4} style={{ display: 'flex', alignItems: 'center' }}> 高级设置</Title>

                    </div>
                </Card>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button style={{ width: '90%' }} onClick={handleSubmit}>提交</button>
            </div>

        </>
    )
}