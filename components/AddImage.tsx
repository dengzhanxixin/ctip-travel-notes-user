import React, { useState, useEffect } from 'react';
import { Button, Image, Upload } from "antd";
import { Toast } from "antd-mobile"
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

import styles from "../styles/post.module.scss";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const maxCount = 6

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface AddImageProps {
    onThumbUrlsChange: (thumbUrls: string[]) => void;
    ImgList: UploadFile[]; // 接收 ImgListList 作为 prop
}

const AddImage: React.FC<AddImageProps> = ({ onThumbUrlsChange, ImgList }) => {
    const [fileList, setFileList] = useState<UploadFile[]>(ImgList);
    const [thumbUrls, setThumbUrls] = useState<string[]>([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!fileList && ImgList) {
            setFileList(ImgList);
        }
    }, [fileList, ImgList]);
    console.log('fileList', fileList)


    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        const newThumbUrls: string[] = [];
        console.log('newFileList', newFileList)
        newFileList.forEach((file: UploadFile) => {
            if (file.url) {
                newThumbUrls.push(file.url);
            } else
                getBase64(file.originFileObj as FileType)
                    .then(base64Data => {
                        newThumbUrls.push(base64Data);
                    })
                    .catch(error => {
                        console.error('Error converting file to base64:', error);
                    });
        });
        setThumbUrls(newThumbUrls);
        onThumbUrlsChange(newThumbUrls);
    }

    const onRemove = (file: UploadFile) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    }

    const beforeUpload = (file: UploadFile) => {
        const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
        if (!isPNG) {
            Toast.show(`只能上传图片格式`)
        }
        return isPNG || Upload.LIST_IGNORE;
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8, fontSize: '14px' }}>上传图片</div>
        </button>
    );


    return (
        <>
            {fileList ? <Upload className={styles.commonModal + ' ' + styles.paramsModal}
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                onRemove={onRemove}
            >
                {fileList.length >= maxCount ? null : uploadButton}
            </Upload> : null}

        </>
    )
}
export default AddImage;