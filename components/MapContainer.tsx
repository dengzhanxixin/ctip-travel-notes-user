import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/MapContainer.module.scss";

interface Props {
  data: {
    poiname: string;
    latitude: number;
    longitude: number;
    address: string;
  };
}

const MapContainer: React.FC<Props> = ({ data }) => {
  const [mapInstance, setMapInstance] = useState<any>({});
  const { poiname, latitude, longitude, address } = data;

  const mapRef = useRef(null); // 创建一个指向 <div id="container"> 的引用

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@amap/amap-jsapi-loader")
        .then((AMapLoader) => {
          AMapLoader.load({
            key: "575c39e9399bb4d468773983fb489d2a",
            version: "2.0",
            plugins: ["AMap.Geolocation", "AMap.Scale", "AMap.Driving"],
          }).then((AMap) => {
            const map = new AMap.Map(mapRef.current, {
              viewMode: "3D",
              zoom: 17,
              center: [longitude, latitude],
            });

            const geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,
              timeout: 10000,
              buttonPosition: "RB",
              position: [longitude, latitude],
              buttonOffset: new AMap.Pixel(10, 20),
              zoomToAccuracy: true,
            });

            const content1 = `<div class="${styles.marker}">
            <h3>${poiname}</h3>
            </div>`;

            const icon = new AMap.Icon({
              size: new AMap.Size(40, 50), // 图标尺寸
              image: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png", // Icon的图像
              imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
              imageSize: new AMap.Size(40, 50), // 根据所设置的大小拉伸或压缩图片
            });
            const marker1 = new AMap.Marker({
              content: content1,
              position: [longitude, latitude], // set the correct position here
              offset: new AMap.Pixel(-17, -42),
            });
            const marker2 = new AMap.Marker({
              icon: icon,
              position: [longitude, latitude], // set the correct position here
              offset: new AMap.Pixel(-17, -42),
            });
            map.add(marker1);

            map.add(marker2);

            setMapInstance(map);
            map.addControl(new AMap.Scale());
            map.addControl(geolocation);
          });
        })
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    }
    return () => {
      if (mapInstance.destroy) {
        mapInstance.destroy();
      }
    };
  }, [data]);

  return (
    <div>
      <div ref={mapRef} id="container" className={styles.map} style={{ height: "800px" }}>
        地图加载中...
      </div>
    </div>
  );
};

export default MapContainer;
