import React, { useState } from "react";
import { Card, Form, Input, Button, Toast, Dialog } from "antd-mobile";
import { motion } from "framer-motion";
import styles from "@/styles/Login.module.scss";
import { useRouter } from "next/router";

const avatars = ["images/avatar1.png", "images/avatar2.png", "images/avatar3.png", "images/avatar4.png"];

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [showAvatars, setShowAvatars] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  // 注册处理函数
  const handleRegister = async () => {
    // 增加的用户名和密码长度验证
    if (username.length < 3) {
      Dialog.alert({
        content: '用户名长度至少为3个字符',
      });
      return; // 提前返回，不执行注册
    }
    if (username.length > 16) {
      Dialog.alert({
        content: '用户名长度至多为16个字符',
      });
      return; // 提前返回，不执行注册
    }

    if (password.length < 6) {
      Dialog.alert({
        content: '密码长度至少为6个字符',
      });
      return; // 提前返回，不执行注册
    }

    if (password.length > 16) {
      Dialog.alert({
        content: '密码长度至多为16个字符',
      });
      return; // 提前返回，不执行注册
    }

    const userData = {
      username,
      password,
      avatar: selectedAvatar,
      likeNote: [],
      saveNote: [],
      followUser: [],
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        Dialog.alert({
          content: '注册成功！',
          onConfirm: () => {
            setIsLogin(true); // 切换回登录视图
          },
        });
      } else {
        const error = await response.json();
        Dialog.alert({
          content: `注册失败：${error.message}`,
        });
      }
    } catch (error) {
      Dialog.alert({
        content: '注册请求失败',
      });
    }
  };


  // 登录处理函数
  const handleLogin = async () => {
    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // 存储Token
        localStorage.setItem('user', JSON.stringify(data.user)); // 存储用户信息
        
        Dialog.alert({
          content: '登录成功！',
          onConfirm: () => {
            // 页面跳转
            router.push(`/person`);
          },
        });
      } else {
        const error = await response.json();
        Dialog.alert({
          content: `登录失败：${error.message}`,
        });
      }
    } catch (error) {
      Dialog.alert({
        content: '登录请求失败',
      });
    }
  };

  return (
    <div className={styles.page}>
      <img src="/images/loginlogo.png" className={styles.logo}/>
      <Card>
        <motion.div initial="hidden" animate="visible" variants={containerVariants} transition={{ duration: 0.5 }}>
          {isLogin ? (
            <>
              <div className={styles.avatarSelection} onClick={() => setShowAvatars(!showAvatars)}>
                <img src={selectedAvatar} className={styles.avatar} alt="Avatar" />
              </div>
              <Form layout="horizontal">
                <Form.Item name="username">
                  <Input placeholder="请输入用户名" clearable onChange={(value) => setUsername(value)} />
                </Form.Item>
                <Form.Item name="password">
                  <Input placeholder="请输入密码" clearable type="password" onChange={(value) => setPassword(value)} />
                </Form.Item>
                <Form.Item>
                  <Button block color="primary" size="large" onClick={handleLogin}>
                    登录
                  </Button>
                </Form.Item>
              </Form>
              <Button fill="none" onClick={() => setIsLogin(false)}>
                没有账户？点此注册
              </Button>
            </>
          ) : (
            <>
              <div className={styles.avatarDisplay} onClick={() => setShowAvatars(!showAvatars)}>
                <img src={selectedAvatar} className={styles.avatar} alt="Selected Avatar" />
              </div>
              {showAvatars && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={avatarVariants}
                  className={styles.avatarSelection}
                >
                  {avatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      className={`${styles.avatar} ${selectedAvatar === avatar ? styles.selected : ""}`}
                      alt={`Avatar ${index}`}
                      onClick={() => {
                        setSelectedAvatar(avatar);
                        setShowAvatars(false);
                      }}
                    />
                  ))}
                </motion.div>
              )}
              <Form layout="horizontal">
                <Form.Item name="username">
                  <Input placeholder="请输入用户名" clearable onChange={(value) => setUsername(value)} />
                </Form.Item>
                <Form.Item name="password">
                  <Input placeholder="请输入密码" clearable type="password" onChange={(value) => setPassword(value)} />
                </Form.Item>
                <Form.Item>
                  <Button block color="primary" size="large" onClick={handleRegister}>
                    注册
                  </Button>
                </Form.Item>
              </Form>
              <Button fill="none" onClick={() => setIsLogin(true)}>
                已有账户？点此登录
              </Button>
            </>
          )}
        </motion.div>
      </Card>
    </div>
  );
};

export default LoginPage;
