import { useEffect, useState, useRef } from "react";
import { Card, Toast, Button, Divider, Ellipsis, CapsuleTabs } from 'antd-mobile'

import styles from "@/styles/WaitCheck.module.scss";
import { useRouter } from "next/router";

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
  checkReason: string;
  user: UserInfo;
};
interface WaterFollowProps {
  travelNoteList: TravelNoteProps[];
  isTab?: boolean
}
const WaitCheck: React.FC<WaterFollowProps> = ({ travelNoteList, isTab }) => {

  const router = useRouter();
  const [checkState, setCheckState] = useState<string>('');
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleClick = (id: number, isChecked: number) => {
    router.push(`/AddPost?id=${id.toString()}`);
  }
  async function fetchId(id: number, username?: string) {
    const response = await fetch(`/api/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, username }) // 注意将 id 包装在对象中
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // 删除成功，显示成功消息
        Toast.show('删除成功！');
        window.location.reload();

      } else {
        // 删除失败，显示失败消息
        Toast.show('删除失败！');
      }
    } else {
      // 请求失败，显示错误消息
      console.error('Error posting data:', response.statusText);
    }
  }
  const Delete = async (id: number, username?: string) => {
    try {
      await fetchId(id, username); // 等待 fetchId 函数完成
    } catch (error) {
      console.error('Error posting data:', error);
      // 处理请求错误的情况
    }
  }

  const handleSetGridRowEnd = (index: number) => {
    const cardRef = cardRefs.current[index];
    if (!cardRef) return;
    const height = cardRef.offsetHeight;
    // grid-row-end: <line> | <span>;设置元素在网格布局中结束的位置
    cardRef.style.gridRowEnd = `span ${Math.ceil(height)}`;
  };
  var version = Math.random();
  const filterData = (travelNoteList: TravelNoteProps[], searchChecked?: string) => {
    if (searchChecked) {
      return travelNoteList.filter((item) => item.isChecked.toString() === searchChecked);
    }
    else
      return travelNoteList;

  };

  const cardContainer = (travelNoteList: TravelNoteProps[], searchChecked?: string) => {
    if (searchChecked) {
      travelNoteList = filterData(travelNoteList, searchChecked)
    }

    return (
      travelNoteList.map((item, i) => (
        <div key={item.id} ref={(ref) => (cardRefs.current[i] = ref)}>
          <Card className={styles.cardcontainer}>
            <div className={styles.content}>
              <div className={styles.restImg}>
                {item.coverImg == "" ?
                  <>
                    <img
                      src='./notSubmit.png'

                      alt={"旅游图片"}
                      width={130}
                      height={80}
                      onLoad={() => handleSetGridRowEnd(i)}
                    />
                  </>
                  : <>
                    <img
                      src={item.coverImg}
                      alt={"旅游图片"}
                      width={120}
                      height={100}
                      onLoad={() => handleSetGridRowEnd(i)}
                    />
                  </>
                }

              </div>

              {item.title != "" ? <div className={styles.travelTitle}>
                <div style={{
                  fontSize: '22px',
                  fontWeight: '800'
                }}>
                  <Ellipsis style={{ width: '100px', overflowWrap: 'break-word' }} direction='end' content={item.title} />
                </div>

                {item.isChecked != 0 ?
                  // <p className={styles.checkReason}>{item.checkReason}</p> 

                  <Ellipsis className={styles.checkReason} style={{ width: '100px', overflowWrap: 'break-word' }} direction='end'
                    content={item.checkReason} />
                  : null}
              </div> : <h3 style={{ width: '200px' }}>标题未编辑</h3>}

            </div>

            <Divider />
            <div className={styles.footer} onClick={e => e.stopPropagation()}>
              <div className={styles.footerLeft}>
                {!item.isChecked ? <Button
                  className={styles.checkingButton}
                  fill='none'
                  style={{ "--text-color": "white" }}
                >待审核 </Button> : item.isChecked == -1 ? <Button
                  className={styles.notSubmitButton}
                  fill='none' style={{ "--text-color": "white" }}
                >待提交</Button> : item.isChecked == 2 ? (<Button
                  className={styles.checkRejectButton}
                  fill='none'
                  style={{ "--text-color": "white" }}
                >审核未通过</Button>):null}

              </div>
              {item.isChecked != 3 ? <div><Button className={styles.editButton} onClick={() => Delete(item.id)}>删除</Button> <Button className={styles.editButton} onClick={() => handleClick(item.id, item.isChecked)}>编辑</Button>
              </div> : <div><Button className={styles.editButton} onClick={() => Delete(item.id)}>删除</Button>
              </div>}
            </div>

          </Card>
        </div>
      ))

    )
  }



  return (
    <>

      <div className={styles.container}>
        {isTab ? 
        <div className="purple-theme">
          <CapsuleTabs className={styles.tab}
        style={{"color":"black"}}>
          <CapsuleTabs.Tab title='全部' key='1'>
            {cardContainer(travelNoteList)}
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title='待审核' key='2'>
            {cardContainer(travelNoteList, "0")}
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title='审核未通过' key='3'>
            {cardContainer(travelNoteList, "2")}
          </CapsuleTabs.Tab>
        </CapsuleTabs>

        </div> 
          : <div>{cardContainer(travelNoteList)}</div>}
      </div>
    </>
  )
}
export default WaitCheck;
