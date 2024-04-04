import { useRouter } from "next/router";
import React from "react";
import { NavBar, SearchBar,Tag } from "antd-mobile";
import Styles from "@/styles/searchPage.module.scss";
import { Value } from "sass";

interface TravelDetailProps {
  [key: string]: any;
}

const SearchInfo: React.FC = () => {
  const router = useRouter();
  const handleClick = (value:string) => {
    router.push(`/showResult?info=${value}`)
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
  const hotcities = [
    {
      key: "1",
      title: "北京",
    },
    {
      key: "2",
      title: "上海",
    },
    {
      key: "3",
      title: "广州",
    },
    {
      key: "4",
      title: "深圳",
    },
    {
      key: "5",
      title: "杭州",
    },
    {
      key: "6",
      title: "南京",
    },
    {
      key: "7",
      title: "武汉",
    },
    {
      key: "8",
      title: "成都",
    },
    {
      key: "9",
      title: "西安",
    },
    {
      key: "10",
      title: "南宁",
    },
    {
      key: "11",
      title: "柳州",
    },
  ]
  return (
    <div className={Styles.container}>
      <div className={Styles.searchBar}>
        <NavBar onBack={() => router.back()}>
          <SearchBar
            placeholder="请输入内容"
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
                    hotcities.map((item, index) => {
                        return (
                            <Tag round className={Styles.tag} onClick={() => router.push('./showSearchResult')}>
                                 {item.title}
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
