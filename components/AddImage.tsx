import React, { useState, useEffect } from 'react';
import { Button, Image, Upload } from "antd";
import { Toast } from "antd-mobile"
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

import styles from "../styles/post.module.scss";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const maxCount = 6
/**
 * 数据类型
 * 上传给父组件的变量是thumbUrls --> <string[]>
 * 父组件的变量是ImgList --> interface InitFile(url)
 * url:图片地址+verson
 * fileList?（file） --> interface InitFile(url)
 *  如果是第一次上传，fileList 存在originFileObj属性，getBase64函数可以将整条file转化成base64
 *    且newThumbUrls.push(base64Data);
 *    AddPost组件存在url属性，类型与thumbUrls相似
 *  如果是第二次上传，Editor中从json读取的images（ImgList）包含url属性：
      {
        "url": "/images/user/id523_images_i0.jpg",
        "width": 0,
        "height": 0
      }
 * 但传给 fileList+verson才能正常显示
      子组件把更新后的thumbUrls（string[]）传递给父组件的tempImages
      等到按下提交按钮之后，tempImages的值映射到父组件EditorData.imaes.url
}
 * 
 */
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
interface InitFile {
    uid: string;
    name: string;
    status: string;
    url: string;
}

const AddImage: React.FC<AddImageProps> = ({ onThumbUrlsChange, ImgList }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [thumbUrls, setThumbUrls] = useState<string[]>([])
    const [loading, setLoading] = useState(false);
    const version = Math.random().toString();
    // console.log('ImgList',ImgList)
    useEffect(() => {
        // 如果 ImgList 不为空，则将其转换为 UploadFile[] 格式并附加版本信息
        if (ImgList && ImgList.length > 0) {
            console.log('image', ImgList);
            const fileListWithVersion: UploadFile[] = ImgList.map((image, index) => ({
                uid: index.toString(),
                name: image.name,
                status: 'done',
                url: `${image.url}?v=${version}`, // 附加版本信息
            }));
            setFileList(fileListWithVersion);
        }
    }, [ImgList]);
    console.log(fileList, typeof (fileList))

    const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        const newThumbUrls: string[] = [];
    
        const updatedFileList: UploadFile[] = await Promise.all(newFileList.map(async (file: UploadFile) => {
            if (file.url) {
                console.log('file.url', file.url)
                let urlWithoutVersion = file.url;
                // 检查是否包含版本信息，如果包含，去掉版本信息
                const versionIndex = urlWithoutVersion.indexOf('?v=');
                if (versionIndex !== -1) {
                    urlWithoutVersion = urlWithoutVersion.substring(0, versionIndex);
                }
                console.log('urlWithoutVersion', urlWithoutVersion)
                newThumbUrls.push(urlWithoutVersion);
                return file

            } else {
                // 文件没有url属性，转换为base64
                try {
                    const base64Data = await getBase64(file.originFileObj as FileType);
                    newThumbUrls.push(base64Data);
                    return {
                        ...file,
                        url: base64Data, // 将base64数据作为url
                    };
                } catch (error) {
                    console.error('Error converting file to base64:', error);
                    return file;
                }
            }
        }));
    
        
        setThumbUrls(newThumbUrls); // 更新缩略图url列表
        onThumbUrlsChange(newThumbUrls); // 触发回调函数
        setFileList(updatedFileList);
    };
    
    // const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    //     setFileList(newFileList);
    //     const newThumbUrls: string[] = [];
    //     newFileList.forEach((file: UploadFile) => {
    //         if (file.url) {
    //             console.log('file.url', file.url)
    //             let urlWithoutVersion = file.url;
    //             // 检查是否包含版本信息，如果包含，去掉版本信息
    //             const versionIndex = urlWithoutVersion.indexOf('?v=');
    //             if (versionIndex !== -1) {
    //                 urlWithoutVersion = urlWithoutVersion.substring(0, versionIndex);
    //             }
    //             console.log('urlWithoutVersion', urlWithoutVersion)
    //             newThumbUrls.push(urlWithoutVersion);
    //         } else {
    //             getBase64(file.originFileObj as FileType)
    //             .then(base64Data => {
    //                 newThumbUrls.push(base64Data);
    //             })
    //             .catch(error => {
    //                 console.error('Error converting file to base64:', error);
    //             });
    //         }

    //     });
    //     setThumbUrls(newThumbUrls);
    //     console.log('newThumbUrls', newThumbUrls)
    //     onThumbUrlsChange(newThumbUrls);
    // }

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
    // console.log('fileList', fileList)


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