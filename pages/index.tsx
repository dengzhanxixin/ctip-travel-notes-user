import { useRouter } from "next/router";



export default function Home() {
  const router = useRouter();
  async function handleClick() {
    router.push(`/bannerTravel`);
  };
  return (
    <>
      <div onClick={handleClick}>123</div>
    </>
  );
}
