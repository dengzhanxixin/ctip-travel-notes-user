import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { NavBar, SearchBar, Tag } from "antd-mobile";
import { DeleteOutline } from "antd-mobile-icons";
import Styles from "@/styles/searchPage.module.scss";

// 热门城市
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

const SearchInfo: React.FC = () => {
  const router = useRouter();
  const info = router.query.info as string;
  const [searchHistory, setSHistory] = useState<string[]>([]);

  const handleClick = (value: string) => {
    const newHistory = [...searchHistory];
    if (value.trim() === "") {
      const idx = newHistory.indexOf(info);
      if (idx !== -1) {
        [newHistory[0], newHistory[idx]] = [newHistory[idx], newHistory[0]];
      } else {
        newHistory.unshift(info);
      }
      const savehistory = newHistory.length > 10 ? newHistory.slice(0, 10) : newHistory;
      localStorage.setItem("searchHistory", JSON.stringify(savehistory));
      setSHistory(savehistory);
      router.push(`/showResult?info=${info}`);
    } else {
      const idx = newHistory.indexOf(value);
      if (idx !== -1) {
        [newHistory[0], newHistory[idx]] = [newHistory[idx], newHistory[0]];
      } else {
        newHistory.unshift(value);
      }
      const savehistory = newHistory.length > 10 ? newHistory.slice(0, 10) : newHistory;
      localStorage.setItem("searchHistory", JSON.stringify(savehistory));
      setSHistory(savehistory);
      router.push(`/showResult?info=${value}`);
    }
  };

  // 加载本地历史搜索记录数据
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSHistory(JSON.parse(storedHistory));
    }
  }, []);

  return (
    <div className={Styles.container}>
      <div className={Styles.searchBar}>
        <NavBar onBack={() => router.push("/bannerTravel")}>
          <SearchBar
            placeholder={info}
            style={{ "--border-radius": "100px", "--height": "32px", width: "100%" }}
            showCancelButton
            onSearch={(value) => handleClick(value)}
          />
        </NavBar>
      </div>
      <div className={Styles.searchContent}>
        <div className={Styles.searchHistory}>
          <span>历史搜索</span>
          <div className={Styles.searchItems}>
            <div className={Styles.searchTags}>
              {searchHistory.map((item, index) => {
                return (
                  <Tag
                    round
                    className={Styles.tag}
                    key={index}
                    onClick={() => {
                      const newHistory = [...searchHistory];
                      var tmp = newHistory[index];
                      newHistory[index] = newHistory[0];
                      newHistory[0] = tmp;
                      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
                      setSHistory(newHistory);
                      router.push(`/showResult?info=${item}`);
                    }}
                  >
                    {item}
                  </Tag>
                );
              })}
            </div>
            <div className={Styles.delete}>
              <DeleteOutline  onClick={()=>{
                setSHistory([]);
                localStorage.removeItem("searchHistory");
              }}/>
            </div>
          </div>
        </div>
        <div className={Styles.hotCity}>
          <span>热门城市</span>
          <div className={Styles.searchTags}>
            {hotCityList.map((item) => {
              return (
                <Tag
                  round
                  className={Styles.tag}
                  key={item.cityID}
                  onClick={() => router.push(`/travelCity?info=${item.cityName}`)}
                >
                  {item.cityName}
                </Tag>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInfo;
