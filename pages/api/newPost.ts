import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from 'path';
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
    images: { url: string, width: number, height: number }[];


    content: string;
    publishTime: string;
    firstPublishTime: string,
    publishDisplayTime: string,
    shootTime: string,
    shootDisplayTime: string
}

interface CurrentData {
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


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        title, coverImg, user, city, isChecked, checkReason, districtPoiCollect,
        content, publishTime, firstPublishTime, publishDisplayTime, shootTime, shootDisplayTime, url,
    } = req.body as CurrentData;
    if (req.method === "POST") {


        // 1. 本地储存文章Json
        const userDataPath = path.join(process.cwd(), 'data', 'user_data', 'userData.json');
        let userData: FormData[] = [];
        try {
            const userDataContent = fs.readFileSync(userDataPath, 'utf8');
            userData = JSON.parse(userDataContent);
        } catch (error) {
            console.error('Error reading userData.json file:', error);
        }
        ;
        const id = userData.length + 1;

        // 2. 将新数据添加到现有数据的末尾
        const newData: FormData = {
            id, title, coverImg, user, city, isChecked, checkReason, districtPoiCollect,
            content, publishTime, firstPublishTime, publishDisplayTime, shootTime, shootDisplayTime,
            images: [],
        };

        // 遍历图片数组，将每张图片写入文件系统并将图片地址添加到 newData.images 数组中
        url.forEach((imageUrl, index) => {
            // const imgPath = `data:image/jpeg;base64,${imageUrl}`;
            const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const imgPath = path.join('public', 'images', 'user',`id${id}_images_i${index}.jpg`);
            const Path = path.join('/', 'images', 'user',`id${id}_images_i${index}.jpg`);

            fs.writeFileSync(imgPath, buffer);

            try {
                console.log('Image uploaded successfully:');
                newData.images.push({ url: Path, width: 0, height: 0 });
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        });
        newData.coverImg = path.join('/', 'images', 'user',`id${id}_images_i${0}.jpg`);;


        // 将新数据对象添加到 userData 数组中
        userData.push(newData);

        // 3. 将合并后的数据写回文件
        try {
            fs.writeFileSync(userDataPath, JSON.stringify(userData), 'utf8');
            console.log('Data added to userData.json successfully');
        } catch (error) {
            console.error('Error writing to userData.json file:', error);
            return res.status(500).json({ success: false, message: 'Failed to write user data' });
        }
    }
}

