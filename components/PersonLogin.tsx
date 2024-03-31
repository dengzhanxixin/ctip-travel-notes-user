import React, { useState } from 'react';
import style from "../styles/person.module.scss";
import { Card, Button, Space, Grid } from "antd-mobile";
import { Upload, Row, Col, Empty, FloatButton } from 'antd';
import type { GetProp, UploadProps, UploadFile } from 'antd';
import { useRouter } from "next/router";
import ImgCrop from 'antd-img-crop';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const PersonLogin = () => {
    const router = useRouter();
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: '/person.png',
          },
      ]);
    
      const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
      };
    
      const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj as FileType);
            reader.onload = () => resolve(reader.result as string);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      };

    //编辑用户个人签名
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState('简单的自我介绍，让你更受欢迎！');
    const [editingText, setEditingText] = useState(text);

    // 处理双击事件，进入编辑模式
    const handleDoubleClick = () => {
        setIsEditing(true);
        setEditingText(text); // 将当前文本设置为编辑状态的文本
    };

    const handleChangeText = (e: any) => {
        setEditingText(e.target.value);
    };

    // 保存文本并退出编辑模式
    const handleSave = () => {
        setText(editingText); // 更新文本
        setIsEditing(false); // 退出编辑模式
    };
    const AddPost = () => {
        router.push(`/AddPost`);

    }

    return (
        <div className={style.background}>

            <Card className={style.cardContainer}>
                <Row>
                    <Col span={8}>
                        <ImgCrop rotationSlider>
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                onPreview={onPreview}
                            >
                                {fileList.length < 1 && '+ Upload'}
                            </Upload>
                        </ImgCrop>

                    </Col>
                    <Col span={16}>
                        <div className={style.username}>
                            尊敬的用户
                        </div>

                        {isEditing ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <textarea
                                    // type="text"
                                    value={editingText}
                                    onChange={handleChangeText}
                                    style={{ height: '30px', backgroundColor: '#f5f5f5', border: '1px dashed #ccc', padding: '0', fontSize: '8px', lineHeight: '12px', flexBasis: '180px' }}
                                    autoFocus
                                />
                                <Button style={{ marginLeft: '8px', fontSize: '12px', flexBasis: '50px' }} onClick={handleSave}>保存</Button>
                            </div>
                        ) : (
                            <div className={style.userintroduction} onClick={handleDoubleClick}>
                                {text}
                            </div>
                        )}

                    </Col>
                </Row>
            </Card>

            <div
                style={{ backgroundColor: '#f0f2f5', height: '80%', borderRadius: '10px 10px 0 0' }}
            >
                <Card
                    title="我的游记"
                    className={style.cardPostWrapper}>
                        <Empty description={false} />
                    <FloatButton className={style.floatButton} tooltip={<div>Documents</div>} onClick={AddPost} />

                </Card>
            </div>


        </div>
    )
}
export default PersonLogin;