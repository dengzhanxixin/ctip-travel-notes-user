import React from "react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/router";
import MapContainer from "@/components/MapContainer";

const Map: React.FC = () => {
  const router = useRouter();
  const { name, lat, lng, address } = router.query;
  const data = {
    name: name as string,
    lat: parseFloat(lat as string),
    lng: parseFloat(lng as string),
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
        {name}
      </NavBar>
      <MapContainer data={data} />
    </div>
  );
};

export default Map;
