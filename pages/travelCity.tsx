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

type spotProps = {
  [key: string]: any;
};

const CityTravelNotes: React.FC = () => {
  const router = useRouter();
  const info = router.query.info as string;
  const travelInfo = { PageSize: 10, PageIndex: 0, searchCity: info, strictSearch: true, searchChecked: 1 };
  const [cityInfo, setCityInfo] = useState<cityProps>(); // 城市信息
  const [spotInfo, setSpotInfo] = useState<spotProps[]>([]); // 景点信息
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

  // 获取相关城市的景点
  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const response = await fetch("/api/getCitySpot", {
          method: "POST",
          body: JSON.stringify({ cityName: info }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSpotInfo(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSpotData();
  }, [info]);

  // 获取相关城市游记
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityResponse = await fetch("/api/getCityInfo", {
          method: "POST",
          body: JSON.stringify({ cityName: info }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (cityResponse.ok) {
          const cityData = await cityResponse.json();
          setCityInfo(cityData);
          setIsReady(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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
        className={`${Styles.header} ${ishidden ? Styles.hidden_header : ""}`}
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0)), url(${cityInfo?.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <NavBar onBack={() => router.back()} />
        <div className={`${Styles.cityInfo} ${ishidden ? Styles.hidden_Info : ""}`}>
          <div className={Styles.cityName}>
            <span>{cityInfo?.cityName}</span>
            <span className={Styles.eName}>{cityInfo?.eName}</span>
          </div>
          <div className={Styles.photoCount}>{cityInfo?.photoCount}</div>
        </div>
      </div>
      <div className={Styles.content} ref={contentRef}>
        <div className={Styles.CitySpots}>
          <img className={Styles.hasDone} src="images/hasdone.png" />
          <ul className={Styles.imgListContainer}>
            {spotInfo.map((item, idx) => (
              <div
                key={idx}
                className={Styles.imgContainer}
                onClick={() => {
                  router.push(`/citySpot?city=${info}&idx=${idx}`);
                }}
              >
                <div className={Styles.text}>{item.poiName}</div>
                <div className={Styles.shortFeature}>{item.shortFeature}</div>
                <img src={item.images[0]} alt={item.poiName} width={135} height={178} className={Styles.img} />
              </div>
            ))}
          </ul>
        </div>
        <div className={Styles.flowTitle}>
          <span className={Styles.titleLeft}>大家怎么玩</span>
          <span className={Styles.titleRight}>推荐</span>
        </div>
        {isReady && <TravelWaterFlow notes={travelInfo} />}
      </div>
    </div>
  );
};

export default CityTravelNotes;
