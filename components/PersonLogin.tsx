import React, { useState, useEffect } from "react";
import style from "../styles/person.module.scss";
import { Card, Button, NavBar, TextArea, Popup, FloatingBubble, Divider, Toast, Dialog } from "antd-mobile";
import { List, Space, message, Row, Input, Avatar } from "antd";
import type { GetProp, UploadProps, UploadFile } from "antd";
import { MoreOutline, EditSFill, SetOutline, ContentOutline, MailOpenOutline, AddCircleOutline, CheckCircleOutline } from "antd-mobile-icons";
import { LikeOutlined, MessageOutlined, StarOutlined, } from "@ant-design/icons";
import { useRouter } from "next/router";
import MyPost from "./MyPost";
import AvatarUpload from "./AvatarUpload";
const path = require("path");


type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const PersonLogin = () => {
  const router = useRouter();

  //编辑用户个人签名
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("简单的自我介绍吧！");
  const [editingText, setEditingText] = useState(text);
  const [visible, setVisible] = useState(false);
  const [visible4, setVisible4] = useState(false)
  const [isEditor, setIsEditor] = useState(false);
  const [isLogin, setIsLogin] = useState(false);// 初始化为未登录状态
  const [imageUrl, setImageUrl] = useState<string>('');
  const [exists, setExists] = useState('');
  


  // 增加新的state来存储用户信息
  const [userInfo, setUserInfo] = useState({
    username: "尊敬的用户",
    avatar: "/person.png", // 这里应该是你的默认头像路径
  });
  const isUsrLogin = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({
        ...userInfo,
        username: user.username,
        avatar: user.avatar,
      });
      fetch(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/api/check-avatar?username=${userInfo.username}`)
      .then(response => response.json())
      .then(data => setExists(data.avatar))
      .catch(error => console.error('Error:', error));
    
      if(exists)
        setUserInfo({
          ...userInfo,
          avatar: exists,
        })
      else{
        const user = JSON.parse(storedUser);
        setUserInfo({
          ...userInfo,
          avatar: user.avatar,
        })
      }
      console.log(user.username)
       // 判断是否登录并更新状态
    }
    
    
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({
        ...userInfo,
        username: user.username,
        avatar: user.avatar,
      });
    }
  }, []);
  
  useEffect(() => {
    if(userInfo.username) {
      fetch(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/api/check-avatar?username=${userInfo.username}`)
        .then(response => response.json())
        .then(data => {
          setExists(data.avatar);
          console.log('exists', data.avatar);
  
          if(data.avatar) {
            setUserInfo(prevUserInfo => ({
              ...prevUserInfo,
              avatar: data.avatar,
            }));
          }
        })
        .catch(error => console.error('Error:', error));
  
      setIsLogin(userInfo.username === "尊敬的用户" ? false : true);
    }
  }, [userInfo.username]); // 只有在 userInfo.username 改变时才触发 useEffect
  


  const handleClick = () => {
    if (!isLogin) {
      router.push("/login");
    }
    else {
      // 移除特定的项
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUserInfo({
        username: "尊敬的用户",
        avatar: "/person.png", // 这里应该是你的默认头像路径
      })
      router.push("/bannerTravel");
    }
  }

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
    console.log(avatarData)

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

  const mockContent = () => (
    <div className={style.navigation}>
      <SetOutline fontSize={iconSize} onClick={() => {
        setVisible4(true)
      }} /> 个人设置
      <br />
      <br />
      <ContentOutline fontSize={iconSize} /> 浏览记录
      <br />
      <br />
      <MailOpenOutline fontSize={iconSize} /> 草稿箱
      <br />
      <br />

      <br />
      <br />
      <Button block color="primary" size="large" onClick={() => handleClick()}>
        {isLogin ? "退出登陆" : "点击登陆"}
      </Button>
    </div>
  );


  return (
    <div className={style.background}>

      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        position="left"
        bodyStyle={{ width: "50vw", padding: "10px" }}
      >
        {mockContent()}
      </Popup>

      <div className={style.top}>
        <MoreOutline
          fontSize={36}
          color="white"
          className={style.more}
          onClick={() => {
            setVisible(true);
          }}
        />
        <Card className={style.cardContainer}>
          {/* 使用state中的avatar显示头像 */}
          <div className={style.avatarContainer}>

            {isEditor ? (
              <div>
                <AvatarUpload onChange={onChange} />
                <img src='/done.png' className={style.editorAvatar} onClick={() => { setIsEditor(false);
                  submitAvatar(userInfo.username, imageUrl); }} />

              </div>

            ) : (
              <div>
                 {!isLogin ?(<></>):(<img src='/add.png' className={style.editorAvatar} onClick={() => {
                  setIsEditor(true)
                }}/>)}
               
                

                <Avatar size={100} className={style.userAvatar} src={userInfo.avatar} alt="avatar" />
              </div>
            )}

          </div>
          <div className={style.username}>
            {/* 使用state中的username显示用户名 */}
            {userInfo.username}
          </div>
          {!isLogin ? null : <> {isEditing ? (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <TextArea
                // type="text"
                value={editingText}
                onChange={handleChangeText}
                style={{
                  height: "60px",
                  backgroundColor: "#f5f5f5",
                  border: "1px dashed #ccc",
                  margin: "1px 0 0 120px",
                  fontSize: "14px",
                  lineHeight: "14px",
                  flexBasis: "180px",
                }}
                autoFocus
              />
              <Button className={style.save} onClick={handleSave}>
                保存
              </Button>
            </div>
          ) : (
            <div className={style.userintroduction} onClick={handleDoubleClick}>
              {text}
            </div>
          )}</>}
         
          {!isLogin ? null : <List.Item style={{ display: 'flex', alignItems: 'center', fontSize: '20px', fontWeight: 'bold', color: 'rgb(243,242,239)', margin: '10px 0 0 50px' }}>
            <div style={{ marginRight: '30px' }}>
              <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />
            </div>
            <div style={{ marginRight: '30px' }}>
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />
            </div>
            <div style={{ listStyle: 'none' }}>
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />
            </div>
          </List.Item>}
          
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
          <EditSFill onClick={AddPost} fontSize={32} />
        </FloatingBubble>
      </div>
    </div>
  );
};
const iconSize = 33;



export async function mockUpload(file: File) {
  // await sleep(3000)
  return {
    url: URL.createObjectURL(file),
  };
}
export default PersonLogin;
