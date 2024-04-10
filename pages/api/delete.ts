import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from 'path';

const userDataPath = path.join(process.cwd(), 'data', 'TravelData.json');

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
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.body;


    if (req.method === "POST") {
        console.log(id);
        const userDataContent = fs.readFileSync(userDataPath, 'utf8');
        let userData: FormData[] = JSON.parse(userDataContent);

        // 在 JavaScript 对象中查找具有匹配 id 的数据
        const indexToDelete = userData.findIndex(item => item.id === id);
        if (indexToDelete !== -1) {
            // 如果找到了匹配的数据，则从数组中删除该数据
            userData.splice(indexToDelete, 1);
            console.log('删除成功');
        } else {
            console.log('没有找到匹配的数据');
        }
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2), 'utf8');
        res.status(200).json({ success: true, message: '删除成功' });



    } else {
        // 如果请求方法不是 POST，返回方法不允许的响应
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}
