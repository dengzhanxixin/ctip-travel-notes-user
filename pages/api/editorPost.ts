import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
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
    images:string[]; 
    content: string;
    publishTime: string;
    firstPublishTime: string,
    publishDisplayTime: string,
    shootTime: string,
    shootDisplayTime: string
}

const userDataPath = path.join(process.cwd(), 'data', 'user_data', 'userData.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        id, title, coverImg, user, city, isChecked, checkReason, districtPoiCollect,
        content, publishTime, firstPublishTime, publishDisplayTime, shootTime, shootDisplayTime, images,
    } = req.body as FormData;

    if (req.method === "POST") {
        try {
           
            let updatedImages: string[] = [];
            if (Array.isArray(images)) {
                updatedImages = images.map((image, index) => {
                    if (image.startsWith('data:image')) {
                        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                        const buffer = Buffer.from(base64Data, 'base64');
                        const imgPath = path.join('public', 'images', 'user', `id${id}_images_i${index}.jpg`);
                        fs.writeFileSync(imgPath, buffer);
                        return path.join('/', 'images', 'user', `id${id}_images_i${index}.jpg`);
                    }
                    return image;
                });
            }
            // console.log('updatedImages',updatedImages);


            // // 读取 JSON 文件并解析为 JavaScript 对象
            const userDataContent = fs.readFileSync(userDataPath, 'utf8');
            let userData: FormData[] = JSON.parse(userDataContent);

            // 在 JavaScript 对象中查找具有匹配 id 的数据
            const indexToDelete = userData.findIndex(item => item.id === id);
            if (indexToDelete !== -1) {
                // 如果找到了匹配的数据，则从数组中删除该数据
                userData.splice(indexToDelete, 1);
            }else{
                console.log('没有找到匹配的数据');
            }

            // 添加新数据到数组中
            
            let newId = userData.length + 1;
            
            const newData: FormData = {
                id:newId,title, coverImg, user, city, isChecked, checkReason, districtPoiCollect,
                content, publishTime, firstPublishTime, publishDisplayTime, shootTime, shootDisplayTime, images:updatedImages
            };

            userData.push(newData);

            // 将更新后的 JavaScript 对象写回 JSON 文件中
            fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2), 'utf8');

            res.status(200).json({ success: true, message: 'Data added/updated successfully' });
        } catch (error) {
            console.error('Error adding/updating data:', error);
            res.status(500).json({ success: false, message: 'Failed to add/update data' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}
