import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from 'path';
interface FormData {
    id: string;
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
    id: string;
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
const userDataPath = path.join(process.cwd(), 'data', 'TravelData.json');


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        id, title, coverImg, user, city, isChecked, checkReason, districtPoiCollect,
        content, publishTime, firstPublishTime, publishDisplayTime, shootTime, shootDisplayTime, url,
    } = req.body as CurrentData;
    if (req.method === "POST") {
        let updatedImages: string[] = [];
        // // 读取 JSON 文件并解析为 JavaScript 对象
        const userDataContent = fs.readFileSync(userDataPath, 'utf8');
        let userData: FormData[] = JSON.parse(userDataContent);

        // 在 JavaScript 对象中查找具有匹配 id 的数据
        const indexToDelete = userData.findIndex(item => item.id === id);
        if (indexToDelete !== -1) {

            // 如果找到了匹配的数据，则从数组中删除该数据
            userData.splice(indexToDelete, 1);
            console.log('找到匹配的数据，准备删除', indexToDelete);
        } else {
            console.log('没有找到匹配的数据');
        }
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2), 'utf8');

        

        try {
            const userDataContent = fs.readFileSync(userDataPath, 'utf8');
            userData = JSON.parse(userDataContent);
        } catch (error) {
            console.error('Error reading userData.json file:', error);
        }

        // 获取最后一条数据的 ID
        const lastData = userData[userData.length - 1];
        const lastId = lastData.id+1;
        const paddedId = String(lastId).padStart(4, '0');

        // const id = userData.length + 1;
        const publishTime = new Date().toISOString();
        console.log('publishTime', publishTime);

        // 2. 将新数据添加到现有数据的末尾
        const newData: FormData = {
            id:paddedId, title, coverImg, user, city, isChecked, checkReason, districtPoiCollect,
            content, publishTime: publishTime, firstPublishTime, publishDisplayTime, shootTime, shootDisplayTime,
            images: [],
        };

        // 遍历图片数组，将每张图片写入文件系统并将图片地址添加到 newData.images 数组中
        url.forEach((imageUrl, index) => {
            // const imgPath = `data:image/jpeg;base64,${imageUrl}`;
            const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const imgPath = path.join('public', 'images', 'user', `id${id}_images_i${index}.jpg`);
            const Path = path.join('/', 'images', 'user', `id${id}_images_i${index}.jpg`).replace(/\\/g, '/');

            fs.writeFileSync(imgPath, buffer);

            try {
                console.log('Image uploaded successfully:');
                newData.images.push({ url: Path, width: 0, height: 0 });
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        });
        newData.coverImg = path.join('/', 'images', 'user', `id${id}_images_i${0}.jpg`).replace(/\\/g, '/');;


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

    console.log('Duplicates removed successfully.');
}

