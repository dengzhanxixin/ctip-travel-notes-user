import React, { PropsWithChildren, FC, useState, useEffect } from "react";
import { TabBar } from "antd-mobile";
import { useRouter } from "next/router";
import { AppOutline, UserOutline, AddSquareOutline } from "antd-mobile-icons";
import Styles from "../styles/bottomBar.module.scss";

const BottomBar: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);// 初始化为未登录状态
  const router = useRouter();
  // 定义底部栏
  const tabs = [
    {
      key: "/bannerTravel",
      title: "游记列表",
      icon: <AppOutline />,
    },
    {
      key: isLogin ? "/AddPost": "/login",
      title: "发布游记",
      icon: <AddSquareOutline />,
    },
    {
      key: "/person",
      title: "我的",
      icon: <UserOutline />,
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLogin(true);
    }
  }, []);

  const setRouteActive = (value: string) => {
    router.push(value);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.content}>{children}</div>
      <div className={Styles.footer}>
        <TabBar activeKey={router.pathname}  onChange={(value) => setRouteActive(value)}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
      </div>
    </div>
  );
};

export default BottomBar;