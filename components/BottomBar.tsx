import React, { PropsWithChildren, FC, useState, useEffect } from "react";
import { TabBar } from "antd-mobile";
import { useRouter } from "next/router";
import { AppOutline, UserOutline, AddSquareOutline } from "antd-mobile-icons";
import Styles from "../styles/bottomBar.module.scss";

const BottomBar: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  // 定义底部栏
  const tabs = [
    {
      key: "/bannerTravel",
      title: "游记列表",
      icon: <AppOutline fontSize={35}/>,
    },
    {
      key: "/AddPost",
      title: "发布游记",
      icon: <AddSquareOutline fontSize={35}/>,
    },
    {
      key: "/person",
      title: "我的",
      icon: <UserOutline fontSize={35}/>,
    },
  ];

  const setRouteActive = (value: string) => {
    const storedUser = localStorage.getItem("user"); 
    if(!storedUser && value === "/AddPost"){
      router.push("/login");
    }
    else{
      router.push(value);
    }
    
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.content}>{children}</div>
      <div className={Styles.footer}>
        <TabBar className={Styles.tabBar} activeKey={router.pathname}  onChange={(value) => setRouteActive(value)}>
        {tabs.map((item) => (
          <TabBar.Item className={Styles.tabBar} key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
      </div>
    </div>
  );
};

export default BottomBar;