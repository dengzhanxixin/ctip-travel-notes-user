import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { NavBar, Swiper} from "antd-mobile";
import Styles from "@/styles/citySpot.module.scss";
import {RightOutline} from "antd-mobile-icons";
import TravelWaterFlow from "@/components/TravelWaterFlow";

interface spotDetailProps {
  [key: string]: any;
}

const CitySpot: React.FC = () => {
  const [spotDetail, setSpotDetail] = useState<spotDetailProps>({});
  const router = useRouter();
  const city = router.query.city as string;
  const idx = parseInt(router.query.idx as string);
  const contentRef = useRef<HTMLDivElement>(null); // 创建 ref
  const [isfixed, setIsFixed] = useState(false);

  const handleScroll = () => {
    const offset = contentRef.current?.scrollTop; // 获取滚动位置
    if (offset && offset > 50) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  function handleToMap() {
    router.push({
      pathname: "/GaoDeMap",
      query: {
        poiname: spotDetail?.poiName,
        latitude: spotDetail?.ggCoordinate.latitude,
        longitude: spotDetail?.ggCoordinate.longitude,
        address: spotDetail?.address,
      },
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getSpotInfo", {
        method: "POST",
        body: JSON.stringify({ cityName: city, idx: idx }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setSpotDetail(data);
    };
    fetchData();


    contentRef.current?.addEventListener("scroll", handleScroll); // 添加滚动事件监听器

    return () => {
      contentRef.current?.removeEventListener("scroll", handleScroll); // 移除滚动事件监听器
    };
  }, [city, idx]);

  return (
    <div className={Styles.container} ref={contentRef}>
      <NavBar className={`${Styles.Navgate} ${isfixed ? Styles.fixed_Nav : ""}`} onBack={() => router.back()}
      left={isfixed && spotDetail.poiName} />
      <div className={Styles.SpotDetail}>
        {spotDetail.images && (
          <Swiper className={Styles.ImageSwiper} indicator={() => null}>
            {spotDetail.images.map((item: any, index: number) => (
              <Swiper.Item key={index}>
                <img src={item} alt={`景点图片 ${index}`} className={Styles.SpotImage} />
              </Swiper.Item>
            ))}
          </Swiper>
        )}
      </div>
      <div className={Styles.content}>
        <span className={Styles.poiName}>{spotDetail.poiName}</span>
        <div className={Styles.scoreAnddescrip}>
          <span className={Styles.scoreAndcout}>
            <span className={Styles.score}>{spotDetail.commentScore}分</span>
            <span className={Styles.count}>{spotDetail.commentCount}条评论</span>
          </span>
          <span className={Styles.description}>{spotDetail.description}</span>
        </div>
        <div className={Styles.openInfo}>
        {spotDetail.openInfo && <span className={Styles.openStatus}>{spotDetail.openInfo.openStatus}</span>}
        {spotDetail.openInfo &&  <span className={Styles.openTime}>{spotDetail.openInfo.openTime}</span>}
        <RightOutline style={{float:"right"}} />
        </div>
        <div className={Styles.addressAndmap}>
            <span className={Styles.address}>{spotDetail.address}</span>
            <span className={Styles.map} onClick={handleToMap}>
              <img src="images/map_icon.png" alt="定位" height={17} width={17} />
              地图
            </span>
        </div>
      </div>
      <div className={Styles.SpotWaterFlow} >
       {spotDetail.poiName && <TravelWaterFlow notes={{ PageSize: 10, PageIndex: 0, searchSpot: spotDetail.poiName, strictSearch: true, searchChecked: 1 }} />}
      </div>
    </div>
  );
};

export default CitySpot;
