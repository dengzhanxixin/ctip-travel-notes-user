import React, { useState, useRef, useEffect } from "react";
import { Swiper, Tag, Space } from "antd-mobile";
import Styles from "@/styles/bannerTravel.module.scss";
import { useRouter } from "next/router";
import TravelWaterFlow from "@/components/TravelWaterfallFlow";

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

type topicProps = {
  topicId: number;
  topicName: string;
  remark: string;
  [key: string]: any;
};

const TravelList: React.FC = () => {
  const searchInfo = { PageSize: 10, PageIndex: 0 };
  const [ishidden, setIsHidden] = useState(false);
  const [topics, setTopics] = useState<topicProps[]>([]);
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
          <div className={`${Styles.hotWords} ${ishidden ? Styles.hidden : ''}`}>
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
            }}
            slideSize={70}
            trackOffset={15}
            loop
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
        <TravelWaterFlow notes={searchInfo} />
      </div>
    </div>
  );
};

export default TravelList;
