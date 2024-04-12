import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from 'react';
import type { FC } from 'react'
import { Typography, Divider, AutoComplete } from 'antd';
import { NavBar, TextArea, Card, Popup, Button, CheckList, Cascader, Toast, NoticeBar, Space, List } from "antd-mobile";
import { EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
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

    }, []); // 空依赖数组保证这段逻辑只在组件挂载时运行一次

    const handleInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        console.log('Now formData.url.length', formData.url.length);
        const conditions = [
            { condition: !formData.title, message: '标题不能为空' },
            { condition: !formData.content, message: '正文不能为空' },
            { condition: formData.url.length = 0, message: '图片不能为空' }
        ];

        const errorMessage = conditions
            .filter(condition => condition.condition)
            .map(condition => condition.message)
            .join('且');

        if (errorMessage) {
            Toast.show(errorMessage);
            return;
        }

        setFormData({ ...formData, url: tempImages });
        setIsReady(true);


    };
    useEffect(() => {
        if (isReady) {
            try {
                const response = fetch(`/api/newPost`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                console.log('response', formData);

                Toast.show('发布成功！');
                router.push('/person');
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }
    }, [isReady]);
    const handleThumbUrlsChange = (thumbUrls: string[]) => {
        // console.log('thumbUrls', thumbUrls)
        setTempImages(thumbUrls);
        console.log('tempImages', tempImages)
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
    console.log('formData.url', formData.url);





    return (
        <>
            <NoticeBar content='本月发布超过五条游记，即可获得100积分奖励' color='alert'
                extra={
                    <Space style={{ '--gap': '12px' }}>
                        <span>查看详情</span>
                    </Space>

                } closeable />
            <div className="containerImage">
                {/* 上传图片 */}
                <div style={{ width: "100%", height: "180px" }}>
                    <div style={{ padding: '10px 0 0 30px', width: '390px' }}>
                        <AddImage ImgList={[]} onThumbUrlsChange={handleThumbUrlsChange} />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                    <TextArea
                        name='title'
                        style={{ width: '90%', height: '10px', "--font-size": '20px' }}
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
                        style={{ width: '90%', height: '100%', "--font-size": '18px' }}
                        onChange={(value) => { handleInputChange('content', value) }}
                        placeholder="请在这里输入你的游记正文吧～"
                        showCount
                        maxLength={300}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </div>
                <div>
                    <List mode='card' style={{ margin: '10px',"--font-size":"18px", }} >
                        <List.Item  prefix={<EnvironmentOutlined />} onClick={handleAddLocation} >
                            {formData.city ? <div style={{color: 'rgb(108, 170, 137)',fontWeight:'700'}}>{formData.city}</div>
                             : '添加地点'}
                        </List.Item>

                        <List.Item prefix={<TeamOutlined />} onClick={() => { setVisible2(true) }}>
                             {selected? <div style={{color: 'rgb(108, 170, 137)',fontWeight:'700'}}>{selected}</div>: '公开设置'}
                            
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
                <div className={styles.buttonContainer}>
                    
                    <Button style={{
                        width: '50%',
                        backgroundColor: 'rgb(130, 191, 166)',
                        color: 'white',
                        flex:'flex-end',
                        borderRadius: '15px',
                        fontSize: '20px',
                        border: '0',
                        marginLeft:'100px',
                        marginTop: '12px'
                    }} onClick={handleSubmit}>提交</Button>
                </div>

            </div></>

    )
}