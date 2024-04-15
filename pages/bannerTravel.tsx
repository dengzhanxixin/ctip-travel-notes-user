import React, { useState, useRef, useEffect } from "react";
import { Swiper, Tag, PullToRefresh, Toast } from "antd-mobile";
import { SearchOutline } from "antd-mobile-icons";
import Styles from "@/styles/bannerTravel.module.scss";
import { useRouter } from "next/router";
import TravelWaterFlow from "@/components/TravelWaterFlow";
import AMapLoader from "@amap/amap-jsapi-loader";

const searchHotWords = ["上海", "上海迪斯尼", "东方明珠塔"];
const hotCityList = [
  { cityName: "上海", cityID: "2", isDomesticCity: "1" },
  { cityName: "北京", cityID: "1", isDomesticCity: "1" },
  { cityName: "广州", cityID: "152", isDomesticCity: "1" },
  { cityName: "杭州", cityID: "14", isDomesticCity: "1" },
  { cityName: "成都", cityID: "104", isDomesticCity: "1" },
  { cityName: "南京", cityID: "9", isDomesticCity: "1" },
  { cityName: "西安", cityID: "7", isDomesticCity: "1" },
  { cityName: "重庆", cityID: "158", isDomesticCity: "1" },
  { cityName: "深圳", cityID: "26", isDomesticCity: "1" },
];

const locateCities = ["上海", "北京", "广州", "杭州", "成都", "南京", "西安", "重庆", "深圳"];

type topicProps = {
  topicId: number;
  topicName: string;
  remark: string;
  [key: string]: any;
};

interface travelCityProps {
  PageIndex: number;
  PageSize: number;
  searchChecked: number; // 游记审核状态
  searchCity?: string; // 查询关于该城市的旅游日记
}

const TravelList: React.FC = () => {
  const [searchInfo, setSearchInfo] = useState<travelCityProps>({ PageSize: 10, PageIndex: 0, searchChecked: 1 });
  const [ishidden, setIsHidden] = useState(false);
  const [topics, setTopics] = useState<topicProps[]>([]);
  const [isready, setIsReady] = useState(false); // 是否已经定位完毕
  const contentRef = useRef<HTMLDivElement>(null); // 创建 ref

  var activeIndex = 0;

  // 点击推荐卡片跳转到详情页
  const router = useRouter();

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
      const response = await fetch("/api/getTopicInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTopics(data.items);
    };
    fetchData();

    // 高德api定位当前城市
    if (typeof window !== "undefined") {
      AMapLoader.load({
        key: "575c39e9399bb4d468773983fb489d2a",
        version: "2.0",
        plugins: ["AMap.Geolocation"],
      })
        .then((AMap) => {
          const OPTIONS = {
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000,
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonOffset: new AMap.Pixel(10, 20),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: true,
            //  定位按钮的排放位置,  RB表示右下
            buttonPosition: "RB",
          };
          var geolocation = new AMap.Geolocation(OPTIONS);
          geolocation.getCityInfo((status: any, result: any) => {
            if (status == "complete") {
              const city = result.city;
              // 因为爬取城市数据有限，因此只能显示爬过城市的数据；未爬过的城市显示全部数据
              if (locateCities.includes(city.slice(0, -1))) {
                setSearchInfo({
                  ...searchInfo,
                  searchCity: city.slice(0, -1),
                });
                setIsReady(true);
              }
            } else {
              setIsReady(true);
            }
          });
        })
        .catch((e) => {
          // 无法定位时也显示全部数据
          setIsReady(true);
          console.log(e);
        });
    }

    contentRef.current?.addEventListener("scroll", handleScroll); // 添加滚动事件监听器

    return () => {
      contentRef.current?.removeEventListener("scroll", handleScroll); // 移除滚动事件监听器
    };
  }, []);

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
          <div
          className={Styles.searchBar}
          onClick={() => {
            router.push(`/searchPage?info=${searchHotWords[activeIndex]}`);
          }}
        >
          <div className={Styles.searchInput}>
            <div className={Styles.city}>{searchInfo.searchCity ? searchInfo.searchCity:"城市"}</div>
            <SearchOutline className={Styles.searchIcon} fontSize={24} color='#333'/>
            <Swiper
              className={Styles.searchWord}
              direction="vertical"
              loop
              autoplay
              allowTouchMove={false}
              onIndexChange={(index) => {
                activeIndex = index;
              }}
              indicator={() => null}
            >
              {searchHotWords.map((item, index) => (
                <Swiper.Item key={index}>
                  <div className={Styles.searchWord}>{item}</div>
                </Swiper.Item>
              ))}
            </Swiper>
          </div>
          <div className={Styles.searchButton}>搜索</div>
        </div>
        
        <div className={`${Styles.hotWords} ${ishidden ? Styles.hidden : ""}`}>
          <ul className={Styles.wordsContainer}>
            {hotCityList.map((item) => (
              <Tag
                round
                className={Styles.tag}
                key={item.cityID}
                onClick={() => {
                  router.push(`/travelCity?info=${item.cityName}`);
                }}
              >
                {item.cityName}
              </Tag>
            ))}
          </ul>
        </div>
      </div>
      <div className={Styles.content} ref={contentRef}>
        <div className={Styles.travelTopics}>
          <Swiper
            style={{
              "--border-radius": "8px",
              marginBottom: "10px",
            }}
            slideSize={70}
            trackOffset={15}
            loop
            autoplay
            stuckAtBoundary={false}
          >
            {topics &&
              topics.map((topic) => {
                return (
                  <Swiper.Item key={topic.topicId} onClick={() => router.push(`/travelTopic?info=${topic.topicId}`)}>
                    <div
                      className={Styles.topicCard}
                      style={{
                        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0)), url(${topic.image?.url})`,
                        backgroundSize: "cover",
                      }}
                    >
                      <div className={Styles.topicName}>
                        {topic.topicName}
                        <span className={Styles.topicHeat}>{topic.heatText}条游记</span>
                      </div>
                    </div>
                  </Swiper.Item>
                );
              })}
          </Swiper>
        </div>
        <div className={Styles.TWf}>
          {isready && <TravelWaterFlow notes={searchInfo} />}
        </div>
      </div>
    </div>
  );
};

export default TravelList;
