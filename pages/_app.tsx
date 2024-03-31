import "@/styles/globals.css";
import type { AppProps } from "next/app";
import BottomBar from "@/components/BottomBar";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <BottomBar>
        <Component {...pageProps} />
      </BottomBar>
    </>
  );
}
