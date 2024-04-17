import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from 'path';

interface LikeResponse {
    username: string;
    likeNote: string[];
    saveNote: string[];
    followUser: string[];
}
export default function handler(req: NextApiRequest, res: NextApiResponse<LikeResponse>) {
    const requestData = req.body;
    const allData = [] as string[]
    const postData = JSON.parse(fs.readFileSync('data/TravelData.json', 'utf8'));

    const usersData = JSON.parse(fs.readFileSync('data/user.json', 'utf8'));
    let likeNoteUsers = [] as string[];
    let saveNoteUsers = [] as string[];
    let followUserUsers = [] as string[];

    if (req.method === 'POST') {
        const { username } = requestData;

        const searchData = postData.filter((item: any) => username === item.user.nickName && item.isChecked == 1)

        const allTravelIds = searchData.map((item: any) => item.id);


        usersData.forEach((user: any) => {
            // 遍历该用户的 likeNote，如果包含 any of allTravelIds，则添加用户名到 likeNoteUsers
            user.likeNote.forEach((id: string) => {
                if (allTravelIds.includes(id)) {
                    likeNoteUsers.push(user.username);
                }
            });
            user.saveNote.forEach((id: string) => {
                if (allTravelIds.includes(id)) {
                    saveNoteUsers.push(user.username);
                }
            });

            // 处理 followUser
            if (user.followUser.includes(username)) {
                followUserUsers.push(user.username);
            }
        });
        const response: LikeResponse = {
            username,
            likeNote: likeNoteUsers,
            saveNote: saveNoteUsers,
            followUser: followUserUsers
        };
        console.log(response);

        res.status(200).json(response);
    }

}