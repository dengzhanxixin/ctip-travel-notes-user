import { useEffect, useState, useRef} from "react";
import { Card, InfiniteScroll } from "antd-mobile";
import Styles from "@/styles/travelWaterfallFlow.module.scss";
import { useRouter } from "next/router";
import Image from "next/image";

interface UserInfo {
    icon: string; // 头像
    interactionText: string;
    nickName: string; // 昵称
    interactionIcon: string;
}

interface TravelNoteProps {
    id: number;
    title: string;
    coverImg: string;
    city: string;
    isChecked: number;
    user: UserInfo;
};
interface WaterFollowProps {
    travelNoteList: TravelNoteProps[];
}
const WaterFollow: React.FC<WaterFollowProps> = ({ travelNoteList }) =>  {

    const router = useRouter();
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

    const handleClick = (id: number, isChecked:number) => {
        router.push(`/travelDetail?id=${id.toString()}`);
   }
    const handleSetGridRowEnd = (index: number) => {
        const cardRef = cardRefs.current[index];
        if (!cardRef) return;
        const height = cardRef.offsetHeight;
        // grid-row-end: <line> | <span>;设置元素在网格布局中结束的位置
        cardRef.style.gridRowEnd = `span ${Math.ceil(height)}`;
    };
    return (
        <>
            <div className={Styles.container}>
                {travelNoteList  &&
                    travelNoteList .map((item, i) => (
                        <div key={item.id} ref={(ref) => (cardRefs.current[i] = ref)}>
                            <Card
                                onClick={() => handleClick(item.id, item.isChecked)}
                                className={Styles.travelCard}
                                bodyStyle={{ padding: "0" }}
                                key={item.id}
                            >
                                <img
                                    src={item.coverImg}
                                    className={Styles.restImg}
                                    alt={"旅游图片"}
                                    width={180}
                                    height={240}
                                    onLoad={() => handleSetGridRowEnd(i)}
                                />
                                <div className={Styles.infoBox}>
                                    <div className={Styles.travelPlace}>
                                        <img
                                            className={Styles.userIcon}
                                            src='/images/location.png'
                                            alt={"地点"}
                                            width={18}
                                            height={18}
                                        />
                                        <span>{item.city}</span>
                                    </div>
                                    <div className={Styles.travelTitle}>
                                        <h3>{item.title}</h3>
                                    </div>
                                    <div className={Styles.travelUser}>
                                        <div className={Styles.userInfo}>
                                            <img className={Styles.userIcon} src={item.user.icon} alt={"用户头像"} width={18} height={18} />
                                            <span className={Styles.userName}>{item.user.nickName}</span>
                                        </div>
                                        <div className={Styles.viewInfo}>
                                            <img
                                                className={Styles.iconSee}
                                                src={item.user.interactionIcon}
                                                alt={" 浏览数"}
                                                width={14}
                                                height={14}
                                            />
                                            <span className={Styles.viewNumber}>{item.user.interactionText}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
            </div>

        </>
    )
}

export default WaterFollow