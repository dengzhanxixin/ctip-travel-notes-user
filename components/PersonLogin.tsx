import React, { useState, useEffect } from "react";
import style from "../styles/person.module.scss";
import { Card, Button, NavBar, TextArea, Popup, FloatingBubble, Divider, Toast, PullToRefresh } from "antd-mobile";
import { List, Space, message, Row, Input, Avatar } from "antd";
import type { GetProp, UploadProps, UploadFile } from "antd";
import { MoreOutline, LoopOutline } from "antd-mobile-icons";

import { LikeOutlined, MessageOutlined, StarOutlined, } from "@ant-design/icons";
import { useRouter } from "next/router";
import MyPost from "./MyPost";
import SideNavigation from "./sideNavigation";
import AvatarUpload from "./AvatarUpload";
const path = require("path");


type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
interface likeData {
  username: string,
  likeNote: string[],
  saveNote: string[],
  followUser: string[]
}
const PersonLogin = () => {
  const router = useRouter();

  //编辑用户个人签名
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("简单的自我介绍吧！");
  const [editingText, setEditingText] = useState(text);
  const [visible, setVisible] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isLogin, setIsLogin] = useState(false);// 初始化为未登录状态
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [likeData, setLikeData] = useState<likeData>(
    {
      username: '',
      likeNote: [],
      saveNote: [],
      followUser: []
    }
  )
  const [exists, setExists] = useState('');
  const [count, setCount] = useState(0);




  // 增加新的state来存储用户信息
  const [userInfo, setUserInfo] = useState({
    username: "尊敬的用户",
    avatar: "/person.png", // 这里应该是你的默认头像路径
  });


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      fetchAvatar(user.username);
      setLikeData({
        ...likeData,
        username: user.username,
      });
      // setUserInfo({
      //   ...userInfo,
      //   username: user.username,
      //   avatar: user.avatar,
      // });
    }
    console.log('set avatar')

    if (userInfo.username !== "尊敬的用户") {

      fetchLikeandSave(userInfo.username);
      console.log('likeData', likeData)
      setIsLogin(userInfo.username === "尊敬的用户" ? false : true);
    }
  }, [userInfo.username, count]);





  const fetchLikeandSave = (username: string) => {

    console.log('fetchLikeandSave')
    fetch(`/api/getlikeData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
      .then(response => response.json()) // 解析响应数据为 JSON
      .then(data => {
        if (JSON.stringify(data.likeNote) !== JSON.stringify(likeData.likeNote)) {
          console.log('condition', JSON.stringify(data.likeNote) !== JSON.stringify(likeData.likeNote))
          setCount((count) => count + 1)
        }
        if (data) {
          setLikeData({
            ...likeData,
            likeNote: data.likeNote,
            saveNote: data.saveNote,
            followUser: data.followUser
          })
          console.log('data', data)
        }

      })
      .catch(error => {
        console.error('Error posting data:', error);
      });


  }

  const fetchAvatar = (username: string) => {
    const url = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/api/check-avatar?username=${username}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setExists(data.avatar);
        console.log('exists', data.avatar);

        const updatedAvatarUrl = data.avatar ? `${data.avatar}?timestamp=${new Date().getTime()}` : data.avatar;

        if (updatedAvatarUrl && updatedAvatarUrl !== userInfo.avatar) {
          // 只有在新的头像 URL 与当前存储的不同时才更新 userInfo
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            avatar: updatedAvatarUrl,
            username: username
          }));
        }
      })
      .catch(error => console.error('Error:', error));
  };



  // 处理双击事件，进入编辑模式
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditingText(text); // 将当前文本设置为编辑状态的文本
  };

  const handleChangeText = (e: any) => {
    setEditingText(e.target.value);
  };

  // 保存文本并退出编辑模式
  const handleSave = () => {
    setText(editingText); // 更新文本
    setIsEditing(false); // 退出编辑模式
  };
  const AddPost = () => {
    console.log(userInfo.username);
    if (!isLogin) {
      router.push("/login");
    } else {
      router.push(`/AddPost?username=${userInfo.username.toString()}`);
    }

  };
  const onChange = (url: string) => {
    setImageUrl(url)
  }
  const submitAvatar = (username: string, url: string) => {
    const avatarData = {
      username,
      url,
    };
    try {
      fetch(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/api/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(avatarData)
      })
        .then(response => response.json()) // 解析响应数据为 JSON
        .then(data => {
          // 更新用户信息中的头像路径
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            avatar: data.user.avatar // 使用从服务器返回的新头像路径更新用户信息
          }));

          Toast.show('修改头像成功！');

        })
        .catch(error => {
          console.error('Error posting data:', error);
        });
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }


  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );





  return (
    <>

    <div className={style.background}>
      <div className={style.top}>

        <MoreOutline
          fontSize={36}
          color="white"
          className={style.more}
          onClick={() => {
            setVisible(true);
          }}
        />
        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false);
          }}
          position="left"
          bodyStyle={{ width: "50vw" }}
        >
          <SideNavigation isLogin={isLogin} />


        </Popup>



        <Card className={style.cardContainer}>
          {/* 使用state中的avatar显示头像 */}
          <div className={style.overlay}></div>
          <div className={style.avatarContainer}>

            {isEditor ? (
              <div>
                <AvatarUpload onChange={onChange} />
                <img src='/done.png' className={style.editorAvatar} onClick={() => {
                  setIsEditor(false);
                  submitAvatar(userInfo.username, imageUrl);
                }} />

              </div>

            ) : (
              <div>
                {!isLogin ? (<></>) : (<img src='/add.png' className={style.editorAvatar} onClick={() => {
                  setIsEditor(true)
                }} />)}
                <img className={style.userAvatar} src={userInfo.avatar} alt="avatar" style={{ width: "100px", height: "100px" }} />
              </div>
            )}

          </div>
          <div className={style.username}>
            {/* 使用state中的username显示用户名 */}
            {userInfo.username}
          </div>
          {!isLogin ? null : <> {isEditing ? (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>

            </div>
          ) : (
            <div className={style.userintroduction} onClick={handleDoubleClick}>
              {text}
            </div>
          )}</>}


          {!isLogin ? null :
            <div className={style.like}>
              <List.Item style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: 'rgb(243,242,239)', margin: '10px 0 0 10px', zIndex: 2 }}>
                <div style={{ marginRight: '40px' }}>
                  <IconText icon={LikeOutlined} text={
                    isLogin ? `获赞 ${likeData?.likeNote.length.toString()}` : '0'}
                  />
                </div>
                <div style={{ marginRight: '40px' }}>
                  <IconText icon={StarOutlined} text={`收藏 ${likeData?.saveNote.length.toString() ?? '0'}`} key="list-vertical-like-o" />
                </div>
                <div style={{ listStyle: 'none' }}>
                  <IconText icon={MessageOutlined} text={`粉丝 ${likeData?.followUser.length.toString() ?? '0'}`} key="list-vertical-like-o" />
                </div>
              </List.Item>

            </div>}


        </Card>

      </div>

      <div className={style.bottom}>
        <MyPost />
        <FloatingBubble
          style={{
            "--initial-position-bottom": "84px",
            "--initial-position-right": "24px",
            "--edge-distance": "24px",
            "--background": "rgb(130, 191, 166)",
          }}
        >
          <LoopOutline onClick={() => fetchLikeandSave(userInfo.username)} style={{ color: "white" }} fontSize={32} />

        </FloatingBubble>
      </div>

    </div>
    </>


    
  );
};




export async function mockUpload(file: File) {
  // await sleep(3000)
  return {
    url: URL.createObjectURL(file),
  };
}
export default PersonLogin;
