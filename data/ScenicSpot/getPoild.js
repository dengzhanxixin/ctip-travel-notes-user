const fs = require("fs");
const request = require("request");

const CityList = [
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

function sendRequest(cityInf, idx) {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: "https://m.ctrip.com/restapi/soa2/18109/json/getAttractionList?_fxpcqlniredt=09031037113625011588&x-traceID=09031037113625011588-1713076646345-2682405",
        method: "POST",
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          "content-type": "application/json",
          cookieorigin: "https://m.ctrip.com",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        json: {
          index: idx,
          count: 10,
          sortType: 1,
          isShowAggregation: true,
          districtId: parseInt(cityInf.cityID),
          scene: "DISTRICT",
          pageId: "214062",
          traceId: "600705fa-2e0f-9f2c-c249-179af9143097",
          extension: [
            { name: "osVersion", value: "16.6" },
            { name: "deviceType", value: "ios" },
          ],
          filter: { filterItems: [] },
          crnVersion: "2020-09-01 22:00:45",
          isInitialState: true,
          head: {
            cid: "09031037113625011588",
            ctok: "",
            cver: "1.0",
            lang: "01",
            sid: "8888",
            syscode: "09",
            auth: "",
            xsid: "",
            extension: [],
          },
        },
      },
      (error, response, body) => {
        if (error) reject(error);
        else {
          // 返回当前城市用户游记数据
          resolve(body.attractionList);
        }
      }
    );
  });
}

let PoidsbyCity = [];
async function fetchAllData() {
  for (let i = 0; i < CityList.length; i++) {
    let responseData = [];
    try {
      // 等待sendRequest解析完成，然后将数据push到responseData
      const data = await sendRequest(CityList[i], 1);
      data.forEach((info) => {
        responseData.push({
          poiName: info.card.poiName,
          poiId: info.card.poiId,
        });
      });
    } catch (error) {
      console.error("请求发生错误：", error);
    }
    PoidsbyCity.push({
      cityName: CityList[i].cityName,
      cityID: parseInt(CityList[i].cityID),
      scenicSpot: responseData,
    });
  }
  fs.writeFileSync(
    "ScenicSpot.json",
    JSON.stringify(PoidsbyCity)
  );
}

fetchAllData();
