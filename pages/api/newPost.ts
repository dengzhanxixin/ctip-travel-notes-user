import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from 'path';
interface FormData {
    id: number;
    title: string;
    content: string;
    images: string[]; // 所有图片
    publishDisplayTime: string;
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, title, content,images, publishDisplayTime } = req.body as FormData;
    if (req.method === "POST") {
        images.forEach((image, index) => {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const imgPath = path.join(process.cwd(), 'data', 'user_data', 'images', `id${id}_images_i${index}.jpg`);
            try {
                fs.writeFileSync(imgPath, buffer, 'base64');
                res.status(200).json({ success: true, message: 'Image uploaded successfully' });
            } catch (error) {
                console.error('Error uploading image:', error);
                res.status(500).json({ success: false, message: 'Failed to upload image' });
            }
        })
    }
    console.log('ok')
}
