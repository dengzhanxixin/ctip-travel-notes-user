import React, { useState, useEffect } from 'react';
import { Button, Image, Upload, Modal } from "antd";
import { Toast, Swiper } from "antd-mobile"
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

import styles from "../styles/post.module.scss";
// import antdStyle from "../styles/upload.antd.css";
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
interface DraggableUploadListItemProps {
    originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    file: UploadFile<any>;
}
const DraggableUploadListItem = ({ originNode, file }: DraggableUploadListItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: file.uid,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'move',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            // prevent preview event when drag end
            className={isDragging ? 'is-dragging' : ''}
            {...attributes}
            {...listeners}
        >
            {/* hide error tooltip when dragging */}
            {file.status === 'error' && isDragging ? originNode.props.children : originNode}
        </div>
    );
};

const AddImage: React.FC<AddImageProps> = ({ onThumbUrlsChange, ImgList }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [thumbUrls, setThumbUrls] = useState<string[]>([])
    const [loading, setLoading] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<UploadFile | null>(null);
    const [previewImage, setPreviewImage] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);

    const sensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    });
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
                // url: `${image.url}?v=${version}`, // 附加版本信息
                url: image.url, // 直接使用原始 URL
            }));
            setFileList(fileListWithVersion);
        }
    }, [ImgList]);
    // console.log(fileList, typeof (fileList))

    const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        const newThumbUrls: string[] = [];
        // console.log('newFileList', newFileList)
        const updatedFileList: UploadFile[] = await Promise.all(newFileList.map(async (file: UploadFile) => {
            if (file.url) {

                let urlWithoutVersion = file.url;
                // 检查是否包含版本信息，如果包含，去掉版本信息
                const versionIndex = urlWithoutVersion.indexOf('?v=');
                if (versionIndex !== -1) {
                    urlWithoutVersion = urlWithoutVersion.substring(0, versionIndex);
                }

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

    const onRemove = (file: UploadFile) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
        setPreviewVisible(false);
    }

    const beforeUpload = (file: UploadFile) => {
        const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
        if (!isPNG) {
            Toast.show(`只能上传图片格式`)
            return Upload.LIST_IGNORE;
        }

        // 设置上传图片的大小限制为 2MB
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size && file.size > maxSize) {
            Toast.show('上传的图片大小不能超过2MB');
            return Upload.LIST_IGNORE;
        }

        return true; // 允许上传
    }
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setFileList(prevFileList => {
                const oldIndex = prevFileList.findIndex(file => file.uid === active.id);
                const newIndex = prevFileList.findIndex(file => file.uid === over.id);

                return arrayMove(prevFileList, oldIndex, newIndex);
            });
        }
    };
    useEffect(() => {
        const newThumbUrls = fileList.map(file => file.url).filter(Boolean) as string[];
        setThumbUrls(newThumbUrls);
        onThumbUrlsChange(newThumbUrls);
    }, [fileList]);



    const handlePreview = async (file: UploadFile) => {
        // 点击图片的处理逻辑，设置预览图片和显示预览弹窗
        let imageData = '';
        if (file.url) {
            imageData = file.url;
        } else {
            imageData = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(imageData);
        setPreviewVisible(true);
        console.log('previewImage', previewImage)
        setFileToDelete(file);
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8, fontSize: '14px' }}>上传图片</div>
        </button>
    );
    // console.log('fileList.length', fileList.length)

    const test = () => {
        fileList.forEach((file, index) => {
            console.log('key', index, 'file', file, 'fileList.length', fileList.length);
        });
    };
    const upload = (
        <Upload
            className={styles.uploadButton}
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            onRemove={onRemove}
            showUploadList={false}
        >
            {uploadButton}
        </Upload>

    )
    const handleCancel = () => {
        // 关闭预览弹窗的处理逻辑
        setPreviewVisible(false);
        setFileToDelete(null);
    }

    useEffect(() => {
        test();
    }, [fileList]);


    return (
        <>
            {/* <DndContext sensors={[sensor]} onDragEnd={handleDragEnd}>
                <SortableContext items={fileList.map(file => file.uid)} strategy={verticalListSortingStrategy}> */}
            <div className={styles.uploadContainer}>
            {fileList.length === 0 ? (
                upload
            ) : (
                <>
                {fileList.map((file, index) => (
                    <div key={file.uid} >
                        <img className={`${styles.imgUpload} `} src={file.url} alt={file.name} width={'200px'} height={'150px'} onClick={() => handlePreview(file)} /> 
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '10%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            opacity: 0, // 默认隐藏蒙层
                        }}>
                            <span onClick={() => handlePreview(file)}>预览</span>
                            <span onClick={() => onRemove(file)}>删除</span>
                        </div>     
                    </div>
                ))}
                {fileList.length < maxCount && (
                    upload
                )}
                </>
            )}
            </div>
            

            {/* </SortableContext>
            </DndContext> */}
            {/* {fileList ? <Upload className={styles.commonModal + ' ' + styles.paramsModal}
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                onRemove={onRemove}
            >
                {fileList.length >= maxCount ? null : uploadButton}
            </Upload> : null} */}

            {/* {fileList.length == 0 ? upload :
                <Swiper
                    direction='horizontal'

                    indicator={(total, current) => (
                        <div className={styles.customIndicator}>
                            {`${current + 1} / ${total}`}
                        </div>)}
                    style={{
                        '--width': '100%',
                        '--track-padding': '10px'
                    }}>
                    {fileList.map((file, index) => (
                        <Swiper.Item key={index}>
                            <div style={{ position: 'relative' }}>
                                <img src={file.url} alt={file.name} width={'150px'} height={'120px'} onClick={() => handlePreview(file)} />
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    opacity: 0, // 默认隐藏蒙层
                                }}>
                                    <span onClick={() => handlePreview(file)}>预览</span>
                                    <span onClick={() => onRemove(file)}>删除</span>
                                </div>
                            </div>
                            {index === fileList.length - 1 && fileList.length < maxCount && (
                                upload
                            )}
                        </Swiper.Item>

                    ))}
                </Swiper>} */}
            <Modal
                open={previewVisible}
                onCancel={handleCancel}
                okText="删除"
                onOk={() => {
                    if (fileToDelete) {
                        onRemove(fileToDelete);
                        setFileToDelete(null);
                    }
                }}
            >
                <img src={previewImage} alt="预览图片" style={{ width: '100%' }} />
            </Modal>


        </>
    );

}
export default AddImage;