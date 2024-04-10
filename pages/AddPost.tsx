import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Divider,AutoComplete } from 'antd';
import { NavBar, TextArea, Card, Popup, Button, CheckList, Cascader, Toast } from "antd-mobile";
import { EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import AddImage from "../components/AddImage";
import styles from "../styles/post.module.scss";
import { options } from '../data/province'

const items = ['公开可见', '仅自己可见']
interface FormData {
    id: number;
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
    const [visible2, setVisible2] = useState(false)
    const [selected, setSelected] = useState('公开可见')
    const [selectedCity, setSelectedCity] = useState('');
    const [value, setValue] = useState<(string | number)[]>([])
    const [inputValue, setInputValue] = useState('');

    const handleInput = (value: string) => {
        setInputValue(value);
    };

    const handleSelect = (value: string) => {
        setInputValue(value);
    };

    const [formData, setFormData] = useState<FormData>({

        id: 0,
        title: '',
        coverImg: '',
        user: {
            icon: '',
            nickName: '',
            interactionText: '',
            likeCount: 0,
            commentCount: 0,
            shareCount: 0,
            interactionIcon: '',
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
        if (!formData.title || !formData.content) {
            Toast.show('标题和正文不能为空！');
            return; // 不执行提交操作
        }
        const publishDisplayTime = new Date().toISOString();
        setFormData(prevFormData => ({
            ...prevFormData,
            // id: newId,
            publishDisplayTime: publishDisplayTime,

        }));

        try {
            const response = fetch(`/api/newPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            Toast.show('发布成功！');
            router.push('/person');
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };
    const handleThumbUrlsChange = (thumbUrls: string[]) => {
        console.log('thumbUrls', thumbUrls)
        setFormData({ ...formData, url: thumbUrls });
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





    return (
        <div className="containerImage">
            {/* 上传图片 */}
            <div style={{ width: "100%", height: "140px" }}>
                <div style={{ padding: '10px 0 0 30px', width: '390px' }}>
                    <AddImage ImgList={[]} onThumbUrlsChange={handleThumbUrlsChange} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                <TextArea
                    name='title'
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
                        <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'right' }}>{formData.city}</div>

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

        </div>
    )
}