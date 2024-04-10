import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { NavBar } from "antd-mobile";
import Styles from "@/styles/travelCity.module.scss";
import TravelWaterFlow from "@/components/TravelWaterFlow";

type cityProps = {
  cityName: string;
  cityID: number;
  eName: string;
  photoCount: string;
  coverImage: string;
};

const CityTravelNotes: React.FC = () => {
  const router = useRouter();
  const info = router.query.info as string;
  const travelInfo = { PageSize: 10, PageIndex: 0, searchCity: info, strictSearch: true, searchChecked:1 };
  const [cityInfo, setCityInfo] = useState<cityProps>();
  const [isReady, setIsReady] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null); // 创建 ref
  const [ishidden, setIsHidden] = useState(false);

  const handleScroll = () => {
    const offset = contentRef.current?.scrollTop; // 获取滚动位置
    if (offset && offset > 160) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getCityInfo", {
        method: "POST",
        body: JSON.stringify({ cityName: info }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCityInfo(data);
      setIsReady(true);
    };
    fetchData();

    contentRef.current?.addEventListener("scroll", handleScroll); // 添加滚动事件监听器

    return () => {
      contentRef.current?.removeEventListener("scroll", handleScroll); // 移除滚动事件监听器
    };
  }, [info]);

  return (
    <div className={Styles.container}>
      <div
        className={`${Styles.header} ${ishidden ? Styles.hidden_header : ''}`}
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0)), url(${cityInfo?.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <NavBar onBack={() => router.back()} />
        <div className={`${Styles.cityInfo} ${ishidden ? Styles.hidden_Info : ''}`}>
          <div className={Styles.cityName}>
            <span>{cityInfo?.cityName}</span>
            <span className={Styles.eName}>{cityInfo?.eName}</span>
          </div>
          <div className={Styles.photoCount}>{cityInfo?.photoCount}</div>
        </div>
      </div>
      <div className={Styles.content} ref={contentRef}>{isReady && <TravelWaterFlow notes={travelInfo} />}</div>,
    </div>
  );
};

export default CityTravelNotes;
