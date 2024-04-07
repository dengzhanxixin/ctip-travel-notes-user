import { useRouter } from "next/router";
import React, { createContext, useState, useContext } from 'react';
import { Typography, Divider } from 'antd';
import { NavBar, TextArea, Card } from "antd-mobile";
import { EnvironmentOutlined,TeamOutlined } from '@ant-design/icons';
import AddImage from "../components/AddImage";


interface FormData {
    id: number;
    title: string;
    content: string;
    images: string[]; // 所有图片
    publishDisplayTime: string;
}

const { Title } = Typography;
export default function AddPost() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        id: 0,
        title: '',
        content: '',
        publishDisplayTime: '',
        images: []
    });

    const handleInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        const newId = formData.id + 1;
        const publishDisplayTime = new Date().toISOString();

        setFormData(prevFormData => ({
            ...prevFormData,
            id: newId,
            publishDisplayTime: publishDisplayTime,

        }));
        // console.log(formData.images)

        try {
            const response = fetch(`/api/newPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };
    const handleThumbUrlsChange = (thumbUrls: string[]) => {
        setFormData({ ...formData, images: thumbUrls });
    };




    return (
        <div className="containerImage">
            {/* 上传图片 */}
            <div style={{ width: "100%", height: "140px"}}>
                <div style={{ padding: '10px 0 0 30px', width: '390px' }}>
                    <AddImage onThumbUrlsChange={handleThumbUrlsChange} />
                </div>
            </div>
            {/* 加载标题 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                <TextArea
                    name='title'
                    style={{ width: '90%', height:'10px',fontSize: '20px', fontWeight: 'bold' }}
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
                    <div style={{ display: 'flex', paddingRight: '40px' }}>
                        <EnvironmentOutlined style={{ fontSize: '32px', width: '30px', padding: '0 10px 10px 0' }} /> <Title level={4} style={{ display: 'flex', alignItems: 'center' }}> 添加地点</Title>
                    </div>
                    <br />
                    <div style={{ display: 'flex', paddingRight: '40px' }}>
                        <TeamOutlined style={{ fontSize: '32px', width: '30px', padding: '0 10px 10px 0' }} /> <Title level={4} style={{ display: 'flex', alignItems: 'center' }}> 公开选项</Title>
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