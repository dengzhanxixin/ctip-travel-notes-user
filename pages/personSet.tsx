import React, { useState, useEffect } from "react";
import style from "../styles/person.module.scss";
import { Card, Button, NavBar, List, Switch} from "antd-mobile";

import type { GetProp, UploadProps, UploadFile } from "antd";
import { MoreOutline, EditSFill, SetOutline, ContentOutline, MailOpenOutline, AddCircleOutline, CheckCircleOutline } from "antd-mobile-icons";
import { LikeOutlined, MessageOutlined, StarOutlined, } from "@ant-design/icons";
import { useRouter } from "next/router";



export default function personSet() {
    const router = useRouter();
    const back = () => {
        router.push("/person");
    }
    const [userInfo, setUserInfo] = useState({
        username: "尊敬的用户",
        avatar: "/person.png", // 这里应该是你的默认头像路径
      });
    
    
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
        if (userInfo.username !== "尊敬的用户") {
          console.log('set avatar')
        }
      }, [userInfo.username]);
      

    return (
        <>
            <NavBar back='返回' onBack={back}>
                编辑个人资料
            </NavBar>
            <List >
                <List.Item extra={<Switch defaultChecked />}>昵称</List.Item>
                <List.Item  clickable >
                    头像
                </List.Item>
                <List.Item description='管理已授权的产品和设备' clickable>
                    授权管理
                </List.Item>
                <List.Item title='副标题信息A' description='副标题信息B' clickable>
                    这里是主信息
                </List.Item>
            </List>


        </>
    )
}