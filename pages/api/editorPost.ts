import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from 'path';

interface Image {
    url: string;
    width: number;
    height: number;
}
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
    images: Image[];
    content: string;
    publishTime: string;
    firstPublishTime: string,
    publishDisplayTime: string,
    shootTime: string,
    shootDisplayTime: string
}

const userDataPath = path.join(process.cwd(), 'data', 'TravelData.json');
const imagesDirPath = path.join(process.cwd(), '/', 'images', 'user');


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        id, title, user, city, isChecked, checkReason, districtPoiCollect,
        content, publishTime, firstPublishTime, shootTime, shootDisplayTime, images,
    } = req.body as FormData;
    console.log('req.body', images);

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


        // 解析 JSON 数据
        const jsonData = fs.readFileSync(userDataPath, 'utf8');
        const data = JSON.parse(jsonData);

        // 获取最后一条数据的 ID
        const lastData = data[data.length - 1];
        const lastId = lastData.id + 1;


        if (Array.isArray(images)) {
            images.map((image, index) => { console.log('image.url', image); })
            updatedImages = images.map((image, index) => {
                console.log('image.url', image);
                if (image.url.startsWith('data:image')) {
                    const base64Data = image.url.replace(/^data:image\/\w+;base64,/, '');
                    const buffer = Buffer.from(base64Data, 'base64');
                    const imgPath = path.join('public', 'images', 'user', `id${lastId}_images_i${index}.jpg`);
                    const Path = path.join('/', 'images', 'user', `id${lastId}_images_i${index}.jpg`).replace(/\\/g, '/');
                    // 检查是否存在同名文件，如果存在，则删除
                    // try {
                    //     // 同步读取
                    //     const files = fs.readdirSync(imagesDirPath);
                    //     console.log('目录下的文件:', files);
                    // } catch (err) {
                    //     console.error('读取目录出错:', err);
                    // }
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                        console.log(`已删除旧文件：${imgPath}`);
                    } else {
                        console.log(`不存在旧文件：${imgPath}`);
                    }
                    // 写入新的图片文件
                    fs.writeFileSync(imgPath, buffer);
                    console.log('文件写入成功');

                    // 返回新图片的路径，以便保存或进一步处理
                    return Path;
                }
                return image.url;
            });
        }


        // 添加新数据到数组中




        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hour = String(currentDate.getHours()).padStart(2, '0');
        const minute = String(currentDate.getMinutes()).padStart(2, '0');
        const second = String(currentDate.getSeconds()).padStart(2, '0');

        const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

        let coverNewImg = updatedImages[0];
        const newData: FormData = {
            id: lastId, title, coverImg: coverNewImg, user, city, isChecked, checkReason, districtPoiCollect,
            content, publishTime, firstPublishTime, publishDisplayTime: formattedTime, shootTime, shootDisplayTime, images: updatedImages.map(url => ({ url, width: 0, height: 0 })),
        };

        userData.push(newData);

        // 将更新后的 JavaScript 对象写回 JSON 文件中
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2), 'utf8');

        res.status(200).json({ success: true, message: 'Data added/updated successfully' });



    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}
