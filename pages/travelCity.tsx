import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { NavBar } from "antd-mobile";
import Styles from "@/styles/travelCity.module.scss";
import TravelWaterFlow from "@/components/TravelWaterfallFlow";

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
  const travelInfo = { PageSize: 10, PageIndex: 0, searchCity: info, strictSearch: true };
  const [cityInfo, setCityInfo] = useState<cityProps>();

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
    };

    fetchData();
  }, []);

  return (
    <>
      <div
        className={Styles.header}
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0)), url(${cityInfo?.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <NavBar onBack={() => router.back()} />
        <div className={Styles.cityInfo}>
          <div className={Styles.cityName}>
            <span>{cityInfo?.cityName}</span>
            <span className={Styles.eName}>{cityInfo?.eName}</span>
          </div>
          <div className={Styles.photoCount}>{cityInfo?.photoCount}</div>
        </div>
      </div>
      <div>
        <TravelWaterFlow notes={travelInfo} />
      </div>
      ,
    </>
  );
};

export default CityTravelNotes;
