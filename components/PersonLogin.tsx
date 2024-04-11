import React, { useState, useEffect } from "react";
import style from "../styles/person.module.scss";
import { Card, Button, Space, Grid, Popup, FloatingBubble, Divider, Toast, Dialog } from "antd-mobile";
import { Upload, message, Row, Col, Avatar } from "antd";
import type { GetProp, UploadProps, UploadFile } from "antd";
import { MoreOutline, EditSFill, SetOutline, ContentOutline, MailOpenOutline, DeleteOutline } from "antd-mobile-icons";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import MyPost from "./MyPost";


type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const PersonLogin = () => {
  const router = useRouter();

  //编辑用户个人签名
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("简单的自我介绍，让你更受欢迎！");
  const [editingText, setEditingText] = useState(text);
  const [visible, setVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(0);// 初始化为未登录状态

  // 增加新的state来存储用户信息
  const [userInfo, setUserInfo] = useState({
    username: "尊敬的用户",
    avatar: "/person.png", // 这里应该是你的默认头像路径
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // console.log(storedUser);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({
        username: user.username,
        avatar: user.avatar,
      });
      // console.log(user.username)
      setIsLogin(user.username === "尊敬的用户" ? 0 : 1); // 判断是否登录并更新状态
    }
  }, []); // 空依赖数组保证这段逻辑只在组件挂载时运行一次


  const handleClick = () => { 
    if(userInfo.username === "尊敬的用户"){
      router.push("/login");
    }
    else{
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
    if(userInfo.username === "尊敬的用户"){
      router.push("/login");
    }else{
      router.push(`/AddPost`);
    }
    
  };
  const mockContent = () => (
    <div style={{ margin: "100px 10px", padding: "20 60", fontSize: "16px", textAlign: "start", lineHeight: "30px" }}>
      <SetOutline fontSize={iconSize} /> 个人设置
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
      <Button block color="primary" size="large" onClick={()=>handleClick()}>
          {userInfo.username==="尊敬的用户" ? "点击登陆":"退出登陆"}
      </Button>
    </div>
  );

  return (
    <div className={style.background}>
      <MoreOutline
        fontSize={36}
        style={{ position: "absolute", top: "20px", right: "30px", zIndex: "9999" }}
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
        bodyStyle={{ width: "50vw", padding: "10px" }}
      >
        {mockContent()}
      </Popup>

      <Card className={style.cardContainer}>
        <Row>
          <Col span={8}>
            {/* 使用state中的avatar显示头像 */}
            <Avatar size={64} src={userInfo.avatar} alt="avatar" />
          </Col>

          <Col span={16}>
            <div className={style.username}>
              {/* 使用state中的username显示用户名 */}
              {userInfo.username}
            </div>

            {isEditing ? (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <textarea
                  // type="text"
                  value={editingText}
                  onChange={handleChangeText}
                  style={{
                    height: "30px",
                    backgroundColor: "#f5f5f5",
                    border: "1px dashed #ccc",
                    padding: "0",
                    fontSize: "8px",
                    lineHeight: "12px",
                    flexBasis: "180px",
                  }}
                  autoFocus
                />
                <Button style={{ marginLeft: "8px", fontSize: "12px", flexBasis: "50px" }} onClick={handleSave}>
                  保存
                </Button>
              </div>
            ) : (
              <div className={style.userintroduction} onClick={handleDoubleClick}>
                {text}
              </div>
            )}
          </Col>
        </Row>
      </Card>

      <div style={{ backgroundColor: "#f0f2f5", height: "80%", borderRadius: "10px 10px 0 0" }}>
        <MyPost />
        {/* <FloatingBubble className={style.floatButton} tooltip={<div>Documents</div>} onClick={AddPost} /> */}
        <FloatingBubble
          style={{
            "--initial-position-bottom": "84px",
            "--initial-position-right": "24px",
            "--edge-distance": "24px",
            "--background": "#000000",
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
