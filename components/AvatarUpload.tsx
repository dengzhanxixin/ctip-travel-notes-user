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
const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result as string; //base64
            const adjustSize = 1 * 1024
            img.onload = () => {
                const canvas = document.createElement('canvas');
                console.log('canvas', canvas)
                const ctx = canvas.getContext('2d');
                if (ctx) {

                    let width = img.width;
                    let height = img.height;
                    if (width > adjustSize || height > adjustSize) {
                        if (width > height) {
                            height *= adjustSize / width;
                            width = adjustSize;
                        } else {
                            width *= adjustSize / height;
                            height = adjustSize;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);
                    console.log('canvas', canvas)

                    const base64 = canvas.toDataURL(file['type'], 0.5)
                    resolve(base64);

                }

            }
        };
        reader.onerror = (error) => reject(error);
    });

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
            const base64Data = getBase64(info.file.originFileObj as FileType)

            setLoading(false);
            setImageUrl(base64Data.toString());
            onChange(base64Data.toString());
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
        >
            <Upload
                name="avatar"
                listType="picture-circle"
                className={style.userAvatar}
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : uploadButton}
            </Upload>

        </ImgCrop>



    );
};

export default AvatarUpload;