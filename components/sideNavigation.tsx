import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { Layout, Menu, Switch } from 'antd';
import { Button } from "antd-mobile";
import { HomeOutlined, BarChartOutlined, BellOutlined, HeartOutlined, WalletOutlined } from '@ant-design/icons';
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

    const items: MenuItem[] = [
        getItem('Dashboard', '1', <HomeOutlined />),
        getItem('Revenue', '2', <BarChartOutlined />),
        getItem('Notifications', '3', <BellOutlined />),
        getItem('Analytics', '4', <HeartOutlined />),
        getItem('Wallets', '5', <WalletOutlined />),
    ];

    return (
        <div className={style.sideNavContainer}>
            <Layout style={{ minHeight: '100%' }}>
                <div className={style.themeSwitch}>
                    <Switch onChange={changeTheme} /> Change Style
                </div>
                <Menu
                    className={style.sideNavMenu}
                    style={{ width: 256}}
                    defaultSelectedKeys={['1']}
                    theme={theme}
                    items={items}

                />
                <Button  onClick={() => handleClick()} className={style.loginButton}>
                    {isLogin ? "退出登陆" : "点击登陆"}
                </Button>
            </Layout>
        </div>
    )
};

export default SideNavigation;
