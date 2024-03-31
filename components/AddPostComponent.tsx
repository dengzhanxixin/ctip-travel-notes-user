import React, { useState } from 'react';
import style from "../styles/addpost.module.scss";
import { Card, NavBar } from "antd-mobile";
import { Upload, message, Row, Col, Layout, FloatButton } from 'antd';
import type { GetProp, UploadProps,  UploadFile } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter} from "next/router";
import ImgCrop from 'antd-img-crop';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const AddPostComponent = () => {
    const router = useRouter();
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
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
    return (
        <div>
            <NavBar
          onBack={() => {
            router.back();
          }}
          // style={{ backgroundColor: "#fff", position: "fixed", top: 0, left: 0, width: "100%" }}
        >
          编辑游记详情
        </NavBar>
             <ImgCrop rotationSlider>
        <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
        >
            {fileList.length < 5 && '+ Upload'}
        </Upload>
        </ImgCrop>
        

        </div>
    )
}
export default AddPostComponent;