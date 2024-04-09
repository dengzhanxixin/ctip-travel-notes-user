import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Styles from "@/styles/index.module.scss";

export default function Home() {
  const router = useRouter();
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      router.push('/bannerTravel'); // 在三秒后跳转到 '/主页面'
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={Styles.cover}>
      <div className={Styles.time}>{timer} </div>
    </div>
  );
}
