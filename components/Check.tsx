import { useEffect, useState, useRef } from "react";
import { Card, Toast, Button, Divider } from 'antd-mobile'
import styles from "@/styles/checkTable.module.scss";
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
const WaitCheack: React.FC<WaterFollowProps> = ({ travelNoteList }) => {

  const router = useRouter();
  const [checkState, setCheckState] = useState<string>('');
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleClick = (id: number, isChecked: number) => {
    router.push(`/EditPost?id=${id.toString()}`);
  }
  const handleSetGridRowEnd = (index: number) => {
    const cardRef = cardRefs.current[index];
    if (!cardRef) return;
    const height = cardRef.offsetHeight;
    // grid-row-end: <line> | <span>;设置元素在网格布局中结束的位置
    cardRef.style.gridRowEnd = `span ${Math.ceil(height)}`;
  };
  const checkStateChange = (isChecked: number) => {
    if (isChecked === 0) {

      return '未审核'
    } else if (isChecked === 2) {
      return '审核未通过';
    } else {
      // 你可以根据需要设置其他状态
      return '其他状态';
    }
  }

  return (
    <>
      <div className={styles.container}>
        {travelNoteList &&
          travelNoteList.map((item, i) => (
            <div key={item.id} ref={(ref) => (cardRefs.current[i] = ref)}>
              <Card className={styles.cardcontainer}>
                <div className={styles.content}>
                  <Image
                    src={item.coverImg}
                    className={styles.restImg}
                    alt={"旅游图片"}
                    width={100}
                    height={80}
                    onLoad={() => handleSetGridRowEnd(i)}
                  />
                  <div className={styles.travelTitle}>
                    <h3>{item.title}</h3>
                  </div>

                </div>

                <Divider />
                <div className={styles.footer} onClick={e => e.stopPropagation()}>
                  {!item.isChecked?<Button
                    className={styles.checkingButton}
                    color='primary'
                    onClick={() => {
                      Toast.show('点击了底部按钮')
                    }}
                  >待审核 </Button>:<Button
                    className={styles.checkRejectButton}
                    color='primary'
                    onClick={() => {
                      Toast.show('点击了底部按钮')
                    }}
                  >审核未通过</Button>} 
                  
                  
                  {item.isChecked != 3 ? <div><Button className={styles.editButton}>删除</Button> <Button className={styles.editButton} onClick={() => handleClick(item.id, item.isChecked)}>编辑</Button>
                  </div> : <div><Button className={styles.editButton}>删除</Button>
                  </div>}
                </div>

              </Card>
            </div>
          ))}
      </div>
    </>
  )
}
export default WaitCheack;

