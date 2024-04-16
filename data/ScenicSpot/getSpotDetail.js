const fs = require("fs");
const request = require("request");

function sendRequest(idx) {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: "https://m.ctrip.com/restapi/soa2/18109/json/GetSightOverview?_fxpcqlniredt=09031037113625011588&x-traceID=09031037113625011588-1713065791647-7182780",
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
          scene: "DISTRICT",
          poiId: idx,
          useSightExtend: true,
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
          resolve(body);
        }
      }
    );
  });
}


async function fetchAllData() {
  const cityData = fs.readFileSync("ScenicSpot.json", "utf8");
  const json_cityDate = JSON.parse(cityData);
  for (let i = 0; i < json_cityDate.length; i++) {
    let responseData = [];
    const cityData = json_cityDate[i];
    for (let pageidx = 0; pageidx < cityData.scenicSpot.length; pageidx++) {
      try {
        // 等待sendRequest解析完成，然后将数据push到responseData
        const data = await sendRequest(cityData.scenicSpot[pageidx].poiId);
        const info = data;
        responseData.push({
        poiName: info.poiName,
        address: info.address,
        commentCount: info.commentCount,
        commentScore: info.commentScore,
        coordinate: info.coordinate, // BD09标准，百度在用
        districtEName: info.districtEName,
        districtId: info.districtId,
        districtName: info.districtName,
        ggCoordinate: info.ggCoordinate, // GCJ02标准, 高德、google在用
        images: info.imageInfo.poiPhotoImageList,
        openInfo: info.openInfo,
        description: info.rankingInfo.description,
        });

      } catch (error) {
        console.error("请求发生错误：", error);
      }
    }
    // 现在responseData包含了所有数据，可以将其写入文件
    fs.writeFileSync(
      `${json_cityDate[i].cityName}.json`,
      JSON.stringify(responseData)
    );
  }
}

fetchAllData();
