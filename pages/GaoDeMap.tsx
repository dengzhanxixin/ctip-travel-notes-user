import React from "react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/router";
import MapContainer from "@/components/MapContainer";

const Map: React.FC = () => {
  const router = useRouter();
  const { poiname, latitude, longitude, address } = router.query;
  const data = {
    poiname: poiname as string,
    latitude: parseFloat(latitude as string),
    longitude: parseFloat(longitude as string),
    address: address as string,
  };

  return (
    <div style={{ width: "100%" }}>
      <NavBar
        style={{ backgroundColor: "#fff" }}
        onBack={() => {
          router.back();
        }}
      >
        {poiname}
      </NavBar>
      <MapContainer data={data} />
    </div>
  );
};

export default Map;
