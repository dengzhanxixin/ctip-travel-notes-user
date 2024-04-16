import React,{useState,useEffect} from 'react'
import { useRouter } from 'next/router'
import { Card, Button, NavBar, TextArea, Popup, FloatingBubble, Divider, Toast, Dialog } from "antd-mobile";
import { List, Space, message, Row, Input, Avatar } from "antd";
import type { GetProp, UploadProps, UploadFile } from "antd";
import { MoreOutline, EditSFill, SetOutline, ContentOutline, MailOpenOutline, AddCircleOutline, CheckCircleOutline } from "antd-mobile-icons";
import { LikeOutlined, MessageOutlined, StarOutlined, } from "@ant-design/icons";
import style from "../styles/person.module.scss";

interface travelNoteListProps {
    PageIndex: number;
    PageSize: number;
    searchTitle?: string; // 查询标题与搜索词相关的旅游日记
    searchUser?: string; // 查询该用户的旅游日记
    searchCity?: string; // 查询关于该城市的旅游日记
    strictSearch?: boolean; // 严格搜索还是模糊搜索
    searchChecked: number; // 游记审核状态
    notChecked?: boolean; // 
    notSubmit?: boolean;
  }

interface Props {
    notes: travelNoteListProps
}

export default function visitor() {

    const router = useRouter()
    const username = parseInt(router.query.username as string);
    const [exists, setExists] = useState('');
    const [userInfo, setUserInfo] = useState({
        username:username.toString(),
        avatar:''
    })
    const DoneInfo = { PageSize: 10, PageIndex: 0, searchUser: userInfo.username, searchChecked: 1, strictSearch: true };
    useEffect(() => {
        fetchAvatar(username.toString())
    }, [])
    const fetchAvatar = (username: string) => {
        const url = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/api/check-avatar?username=${username}`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            setExists(data.avatar);
            console.log('exists', data.avatar);
    
            if (data.avatar && data.avatar !== userInfo.avatar) {
              setUserInfo(prevUserInfo => ({
                ...prevUserInfo,
                avatar: data.avatar,
              }));
            }
          })
          .catch(error => console.error('Error:', error));
      };
   

    return (
        <>
             <Card className={style.cardContainer}>
          {/* 使用state中的avatar显示头像 */}
          <div className={style.avatarContainer}>
              <div>  
                <img className={style.userAvatar} src={userInfo.avatar} alt="avatar" style={{ width: "100px", height: "100px" }} />
              </div>
          </div>
          <div className={style.username}>
            {/* 使用state中的username显示用户名 */}
            {userInfo.username}
          </div>
         
            <div className={style.userintroduction}>
              text
            </div>

        </Card>
        </>
    )

}