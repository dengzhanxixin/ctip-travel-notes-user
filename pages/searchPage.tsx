import { useRouter } from "next/router";
import React from "react";
import { NavBar, SearchBar,Tag } from "antd-mobile";
import Styles from "@/styles/searchPage.module.scss";

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


interface TravelDetailProps {
  [key: string]: any;
}

const SearchInfo: React.FC = () => {
  const router = useRouter();
  const info = router.query.info as string;
  const handleClick = (value:string) => {
    if(value.trim()===""){
      router.push(`/showResult?info=${info}`)
    }
    else{
      router.push(`/showResult?info=${value}`)
    }
    
  }
  const data = [
    {
      key: "1",
      title: "游记列表",
    },
    {
      key: "2",
      title: "热门游记",
    },
    {
      key: "3",
      title: "热门游记",
    },
    {
      key: "4",
      title: "热门游记",
    },
    {
      key: "5",
      title: "热门游记",
    },
    {
      key: "6",
      title: "热门游记",
    },
    {
      key: "7",
      title: "热门游记",
    },
  ]
  return (
    <div className={Styles.container}>
      <div className={Styles.searchBar}>
        <NavBar onBack={() => router.back()}>
          <SearchBar
            placeholder={info}
            style={{ "--border-radius": "100px", "--height": "32px", width: "100%" }}
            showCancelButton
            onSearch={(value)=>handleClick(value)}
          />
        </NavBar>
      </div>
      <div className={Styles.searchContent}>
        <div className={Styles.searchHistory}>
            <span >历史搜索</span>
            <div className={Styles.searchTags}>
                {
                    data.map((item, index) => {
                        return (
                            <Tag round className={Styles.tag}>
                                 {item.title}
                            </Tag>
                               
                        )
                    })
                }
            </div>
        </div>
        <div className={Styles.hotCity}>
        <span >热门城市</span>
            <div className={Styles.searchTags}>
                {
                    hotCityList.map((item) => {
                        return (
                            <Tag round className={Styles.tag} key={item.cityID} onClick={() => router.push(`/travelCity?info=${item.cityName}`)}>
                                 {item.cityName}
                            </Tag>
                               
                        )
                    })
                }
            </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInfo;
