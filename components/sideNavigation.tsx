import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { Layout, Menu, Switch } from 'antd';
import { Button, List, } from "antd-mobile";
import { UserOutline, CheckShieldOutline, EyeOutline, BellOutline, UnorderedListOutline, SmileOutline} from 'antd-mobile-icons';
import type { GetProp, MenuProps } from 'antd';
import style from '../styles/sideNav.module.scss';

interface Props {
    isLogin: boolean;
}

const { Header, Sider, Content } = Layout;

const SideNavigation: React.FC<Props> = ({ isLogin }) => {

    const router = useRouter();
    const [theme, setTheme] = useState<MenuTheme>('light');

    useEffect(() => {

    }, [isLogin]);

    const handleClick = () => {
        if (!isLogin) {
            router.push("/login");
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push("/bannerTravel");
        }
    };

    const changeTheme = (value: boolean) => {
        setTheme(value ? 'dark' : 'light');
    };

    type MenuTheme = GetProp<MenuProps, 'theme'>;
    type MenuItem = GetProp<MenuProps, 'items'>[number];

    function getItem(
        label: React.ReactNode,
        key?: React.Key | null,
        icon?: React.ReactNode,
        children?: MenuItem[],
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
        } as MenuItem;
    }



    return (
        <div className={style.sideNavContainer}>
            <Layout style={{ width: '100%', height: '100%' }}>

                <div style={{width:"95%",padding:"30px 0 50px"}}>
                    <List header='账户设置'
                    className={style.listItem}
                        mode='card'
                        style={{ "--prefix-width": "30px", "--font-size": "18px",  "--padding-left": "10px"}}>
                        <List.Item prefix={<UserOutline />} onClick={() => {router.push("/personSet")}}
                        >
                            个人设置
                        </List.Item>
                        <List.Item prefix={<CheckShieldOutline />} onClick={() => { }}>
                            账户安全
                        </List.Item>
                        <List.Item prefix={<EyeOutline />} onClick={() => { }}>
                            隐私设置
                        </List.Item>

                    </List>
                    <List header='个人设置'
                        mode='card'
                        className={style.listItem}
                        style={{ "--prefix-width": "30px", "--font-size": "18px",  "--padding-left": "10px"}}>
                        <List.Item prefix={<UserOutline />} onClick={() => { }}
                        >
                            个人主页
                        </List.Item>
                        <List.Item prefix={<BellOutline />} onClick={() => { }}>
                            消息通知
                        </List.Item>
                    </List>
                    <List header='其他设置'
                        className={style.listItem}
                        mode='card'
                        style={{ "--prefix-width": "30px", "--font-size": "18px",  "--padding-left": "10px"}}>
                        <List.Item prefix={<UnorderedListOutline />} onClick={() => { }}
                        >
                            辅助功能
                        </List.Item>
                        <List.Item prefix={<SmileOutline />} onClick={() => { }}>
                            关于我们
                        </List.Item>


                    </List>
                    <div className={style.loginButtonContainer}>
                        <Button onClick={() => handleClick()} className={style.loginButton}>
                            {isLogin ? "退出登陆" : "点击登陆"}
                        </Button>

                    </div>


                </div>


            </Layout>
        </div>
    )
};

export default SideNavigation;
