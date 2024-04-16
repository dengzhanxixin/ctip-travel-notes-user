import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from 'react';
import type { FC } from 'react'
import { Typography, Divider, AutoComplete } from 'antd';
import { NavBar, TextArea, Card, Popup, Button, CheckList, Cascader, Toast, NoticeBar, Space, List, Modal, } from "antd-mobile";
import { EnvironmentOutlined, TeamOutlined, } from '@ant-design/icons';
import { ExclamationCircleFill } from 'antd-mobile-icons'
import AddImage from "../components/AddImage";
import styles from "../styles/post.module.scss";

import { options } from '../data/province'

const items = ['公开可见', '仅自己可见']
interface FormData {
    id: string
    title: string;
    coverImg: string;
    user: {
        icon: string,
        nickName: string,
        interactionText: string,
        likeCount: number,
        commentCount: number,
        shareCount: number,
        interactionIcon: string,
    },
    city: string;
    isChecked: number;
    checkReason: string;
    districtPoiCollect: string;
    url: string[];
    content: string;
    publishTime: string;
    firstPublishTime: string,
    publishDisplayTime: string,
    shootTime: string,
    shootDisplayTime: string
}
interface EditorDetailProps {
    [key: string]: any;
}
interface Image {
    url: string;
    width: number;
    height: number;
}

const { Title } = Typography;
export default function AddPost() {
    const router = useRouter();
    const [visible, setVisible] = useState(true);
    const [visible2, setVisible2] = useState(false)
    const [selected, setSelected] = useState('')
    const [selectedCity, setSelectedCity] = useState('');
    const [value, setValue] = useState<(string | number)[]>([])
    const [inputValue, setInputValue] = useState('');
    const [tempImages, setTempImages] = useState<string[]>([])
    const [isReady, setIsReady] = useState(false);
    const id = parseInt(router.query.id as string);

    const [EditorData, setEditorData] = useState<EditorDetailProps>()
    const [tempEdit, setTempEdit] = useState<Image[]>([]);



    const handleClose = () => {
        setVisible(false);
    };

    const handleInput = (value: string) => {
        setInputValue(value);
    };

    const handleSelect = (value: string) => {
        setInputValue(value);
    };

    const [formData, setFormData] = useState<FormData>({

        id: '',
        title: '',
        coverImg: '',
        user: {
            icon: '',
            nickName: '',
            interactionText: '',
            likeCount: 0,
            commentCount: 0,
            shareCount: 0,
            interactionIcon: "https://images4.c-ctrip.com/target/0zc3v120008xuwygkC3B0.png",
        },
        city: '',
        isChecked: 0,
        checkReason: '',
        districtPoiCollect: '',
        url: [],
        content: '',
        publishTime: '',
        firstPublishTime: '',
        publishDisplayTime: '',
        shootTime: '',
        shootDisplayTime: '',
    });
    const fetchTravelNote = async (id: number) => {
        try {
            const params = new URLSearchParams({
                id: id?.toString(),
            });
            const response = await fetch(`/api/getTravelDetail?${params.toString()}`);
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
            // Toast.show("现在开始添加新的游记吧");
        }
    };
    useEffect(() => {
        const params = new URLSearchParams({
            username: formData.user.nickName?.toString(),
        });

        const storedUser = localStorage.getItem("user");
        // console.log(storedUser);
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData(prevFormData => ({
                ...prevFormData,
                user: {
                    ...prevFormData.user,
                    icon: user.avatar,
                    nickName: user.username,
                },
            }));

        }
        fetchTravelNote(id);
    }, [id]); // 空依赖数组保证这段逻辑只在组件挂载时运行一次

    const handleInputChange = (name: string, value: string) => {
        if (EditorData) {
            setEditorData(prevEditorData => ({
                ...prevEditorData,
                [name]: value
            }));
        }
        else {
            setFormData({ ...formData, [name]: value });
            console.log(formData);
        }
    };

    const handleSubmit = () => {
        // console.log('Now formData.url.length', formData.url.length);
        const conditions = [
            { condition: EditorData?(EditorData && EditorData.title==""):(formData.title==""), message: '未填写标题' },
            { condition: EditorData?(EditorData && EditorData.content==""):(formData.title==""), message: '未填写正文' },
            { condition: tempImages.length == 0 , message: '图片不能为空' }
        ];

        const errorMessage = conditions
            .filter(condition => condition.condition)
            .map(condition => condition.message)
            .join(',\n');

        if (errorMessage) {
            Modal.alert({
                header: (
                    <ExclamationCircleFill
                        style={{
                            fontSize: 44,
                            color: 'var(--adm-color-warning)',
                        }}
                    />
                ),
                title: '注意',
                content: (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', wordWrap: 'break-word' }}>
                        <div style={{ width: '90px', lineHeight: '20px', textAlign: 'center' }}>{errorMessage}</div>
                    </div>
                ),
                closeOnMaskClick: true,
            })
            return;
        }
        if (EditorData) {
            setEditorData(prevEditorData => ({
                ...prevEditorData,
                ...EditorData,
                images: tempEdit,
            }));
        }
        else {
            setFormData({ ...formData, url: tempImages });
        }

        setIsReady(true)
    };
    const handleDraft = () => {
        if ((!formData.title && !formData.content) || ((EditorData && !EditorData.title && !EditorData.content)) && tempImages.length === 0) {
            Modal.alert({
                header: (
                    <ExclamationCircleFill
                        style={{
                            fontSize: 44,
                            color: 'var(--adm-color-warning)',
                        }}
                    />
                ),
                title: '注意',
                content: (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', wordWrap: 'break-word' }}>
                        <div style={{ width: '90px', lineHeight: '20px', textAlign: 'center' }}>游记内容不能为空</div>
                    </div>
                ),
                closeOnMaskClick: true,
            })
        }
        setFormData({ ...formData, url: tempImages, isChecked: -1 });
        setIsReady(true)
        
    }

    useEffect(() => {

        try {
            if (isReady) {
                if (EditorData) {
                    const response = fetch(`/api/editorPost`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(EditorData)
                    });
                    Toast.show('编辑成功！');
                    
                }
                else{
                    const response = fetch(`/api/newPost`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    if(formData.isChecked==-1){
                        Toast.show('保存成功！');
                    }else{
                        Toast.show('发布成功！');
                    }
                    

                } 
                
                router.push('/person');
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }


    }, [isReady]);
    const handleThumbUrlsChange = (thumbUrls: string[]) => {
        if (EditorData) {
            const updatedTempImages = thumbUrls.map((url, index) => ({
                url: url,
                width: 0,
                height: 0
            }));
            setTempEdit(updatedTempImages);

        }
        setTempImages(thumbUrls);

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
            setFormData(prevFormData => ({
                ...prevFormData,
                city: selectedCity,
            }));
            Toast.show(`你选择了 ${selectedCity}`);
        } else {
            Toast.show('你没有进行选择');
        }
    };
    // console.log('formData.url', formData.url);
    const back = () => router.push('/person');





    return (
        <>
        {EditorData ? (<NavBar back='返回' onBack={back}>
          编辑游记
        </NavBar>):<NoticeBar content='本月发布超过五条游记，即可获得100积分奖励' color='alert'
                extra={
                    <Space style={{ '--gap': '12px' }}>
                        <span>查看详情</span>
                    </Space>

                } closeable />
            }
            <div className="containerImage">
            
                {/* 上传图片 */}
                <div style={{ width: "90%", height: "180px" }}>
                    <div style={{ padding: '5px 0 0 10px' }}>
                        {EditorData ? (
                            <AddImage ImgList={EditorData.images} onThumbUrlsChange={handleThumbUrlsChange} />
                        ) : (
                            <AddImage ImgList={[]} onThumbUrlsChange={handleThumbUrlsChange} />
                        )}

                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                    <TextArea
                        name='title'
                        style={{ width: '90%', height: '10px', "--font-size": '20px' }}
                        value={EditorData && EditorData.title}
                        onChange={(value) => { handleInputChange('title', value) }}
                        placeholder="请填写你的游记标题～"
                        showCount
                        maxLength={30}
                        autoSize />
                </div>
                <Divider dashed />
                {/* 编写正文 */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20px', height: '120px', marginBottom: '10px' }}>
                    <TextArea
                        name='content'
                        value={EditorData && EditorData.content}
                        style={{ width: '90%', height: '100%', "--font-size": '18px' }}
                        onChange={(value) => { handleInputChange('content', value) }}
                        placeholder="请在这里输入你的游记正文吧～"
                        showCount
                        maxLength={300}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </div>
                <div>
                    <List mode='card' style={{ margin: '10px', "--font-size": "18px", }} >
                        <List.Item prefix={<EnvironmentOutlined />} onClick={handleAddLocation} >
                            {EditorData ? EditorData.city :
                                (formData.city ? <div style={{ color: 'rgb(108, 170, 137)', fontWeight: '700' }}>{formData.city}</div>
                                    : '添加地点')}
                        </List.Item>

                        <List.Item prefix={<TeamOutlined />} onClick={() => { setVisible2(true) }}>
                            {selected ? <div style={{ color: 'rgb(108, 170, 137)', fontWeight: '700' }}>{selected}</div> : '公开设置'}

                        </List.Item>


                        <List.Item prefix={<EnvironmentOutlined />} onClick={() => { }}>
                            高级设置
                        </List.Item>
                    </List>



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

            </div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '15px', paddingLeft: '1px', width: '100%' }}>
                {EditorData ?(null): <Button style={{
                    width: '30%',
                    height: '140%',
                    backgroundColor: 'white',
                    border: '1px solid rgb(130, 191, 166)',
                    color: 'white',
                    borderRadius: '15px',
                    fontSize: '20px',

                }} onClick={handleDraft}>
                    <div style={{
                        display: 'flex',
                        width: '80%',
                        flexWrap: 'wrap',
                        height: '80px',
                        marginLeft: '10px',
                        // marginRight: '30px',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <img src='./submit.png' style={{ width: '60px' }}></img>
                        <span style={{ fontSize: '18px', color: 'rgb(130, 191, 166)', fontWeight: '500' }}>草稿箱</span>
                    </div>
                </Button>}


                <Button style={{
                    width: '30%',
                    height: '140%',
                    backgroundColor: 'white',
                    border: '1px solid rgb(130, 191, 166)',
                    color: 'white',
                    borderRadius: '15px',
                    fontSize: '20px',

                }} onClick={handleSubmit}>
                    <div style={{
                        display: 'flex',
                        width: '80%',
                        flexWrap: 'wrap',
                        height: '80px',
                        marginLeft: '10px',
                        // marginRight: '30px',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <img src='./drawer.png' style={{ width: '60px' }}></img>
                        <span style={{ fontSize: '18px', color: 'rgb(130, 191, 166)', fontWeight: '500' }}>提交</span>
                    </div>
                </Button>
            </div >
        </>

    )
}