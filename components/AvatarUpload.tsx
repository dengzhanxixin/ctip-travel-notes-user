import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, message, Upload } from 'antd';
import type { GetProp, UploadProps, UploadFile } from 'antd';
import style from "../styles/person.module.scss";
import ImgCrop from 'antd-img-crop';
import compressor from 'compressorjs';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface AvatarUploadProps {
    onChange: (url: string) => void;// 假设子组件返回的是图片 URL
}
const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({ onChange }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    // const [fileList, setFileList] = useState<UploadFile[]>([]);


    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
                onChange(url);
            });
        }
    };


    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );


    return (
        <ImgCrop
            rotationSlider
            cropShape='round'
            quality={0.8}
        >
            <Upload
                name="avatar"
                listType="picture-circle"
                className={style.userAvatar}
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%',borderRadius: '50%'}} /> : uploadButton}
            </Upload>

        </ImgCrop>



    );
};

export default AvatarUpload;