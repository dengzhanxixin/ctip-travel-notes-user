import "@/styles/globals.css";
import "@/public/iconfont/iconfont.css";
import "@/public/ShareIcons/iconfont.css";
import type { AppProps } from "next/app";
import BottomBar from "@/components/BottomBar";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      {(router.pathname === "/travelDetail" || router.pathname === "/searchPage" 
      || router.pathname === "/" || router.pathname === "/GaoDeMap") ? (
        <Component {...pageProps} />
      ) : (
        <BottomBar>
          <Component {...pageProps} />
        </BottomBar>
      )}
    </>
  );
}
