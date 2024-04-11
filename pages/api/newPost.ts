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
const userDataPath = path.join(process.cwd(), 'data', 'TravelData.json');


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        id, title, coverImg, user, city, isChecked, checkReason, districtPoiCollect,
        content, publishTime, firstPublishTime, publishDisplayTime, shootTime, shootDisplayTime, url,
    } = req.body as CurrentData;
    if (req.method === "POST") {
        // const jsonData = fs.readFileSync(userDataPath, 'utf8');
        // const dataArray = JSON.parse(jsonData);
        // const indexesToDelete: number[] = [];
        // // 遍历数组以查找重复的 ID 和发布时间更早或为空的对象
        // dataArray.forEach((item: CurrentData, index: number) => {
        //     const currentIndex = indexesToDelete.indexOf(index);
        //     if (currentIndex !== -1) return; // 如果该对象已被标记为要删除，则跳过

        //     const duplicateIndex = dataArray.findIndex((otherItem: CurrentData, otherIndex: number) => {
        //         return index !== otherIndex && item.id === otherItem.id;
        //     });

        //     if (duplicateIndex !== -1) {
        //         const earlierItem = dataArray[duplicateIndex].publishDisplayTime;
        //         const currentItem = item.publishDisplayTime;
        //         if (!earlierItem || (currentItem && earlierItem > currentItem)) {
        //             indexesToDelete.push(duplicateIndex);
        //         } else {
        //             indexesToDelete.push(index);
        //         }
        //     }
        // });

        // // 删除重复的对象
        // indexesToDelete.forEach((indexToDelete) => {
        //     dataArray.splice(indexToDelete, 1);
        // });

        // // 将更新后的数组写回到 JSON 文件中
        // fs.writeFileSync('yourData.json', JSON.stringify(dataArray, null, 2), 'utf8');

        // 1. 本地储存文章Json
        console.log('ok');

        let userData: FormData[] = [];
        try {
            const userDataContent = fs.readFileSync(userDataPath, 'utf8');
            userData = JSON.parse(userDataContent);
        } catch (error) {
            console.error('Error reading userData.json file:', error);
        }
        ;
        const id = userData.length + 1;
        const publishTime = new Date().toISOString();
        console.log('publishTime',publishTime);

        // 2. 将新数据添加到现有数据的末尾
        const newData: FormData = {
            id, title, coverImg, user, city, isChecked, checkReason, districtPoiCollect,
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

