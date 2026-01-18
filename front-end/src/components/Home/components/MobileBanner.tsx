import { useEffect, useState } from "react";
import Image from "next/image";
interface PropTypes {
  totalbanner?: number;
}

const MobileBanner = ({ totalbanner }: PropTypes) => {
  const [indexBanner, setIndexBanner] = useState(0);
  const dataBanners = [
    {
      id: 1,
      title: "Banner 1",
      backgroundColor: "bg-black",
      src: "/banner/banner1.jpeg",
    },
    {
      id: 2,
      title: "Banner 2",
      backgroundColor: "bg-yellow-500",
      src: "/banner/banner2.jpeg",
    },
    {
      id: 3,
      title: "Banner 3",
      backgroundColor: "bg-red-500",
      src: "/banner/banner5.jpeg",
    },
    {
      id: 4,
      title: "Banner 4",
      backgroundColor: "bg-green-500",
      src: "/banner/banner6.jpeg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndexBanner((prevIndex) =>
        prevIndex === dataBanners.length - 1 ? 0 : prevIndex + 1,
      );
    }, 6000); // 6 detik

    return () => clearInterval(interval);
  }, [dataBanners.length]);

  return (
    <div className="relative w-screen h-[200px] overflow-hidden">
      {/* Banner aktif */}
      <div
        className={`   overflow-hidden h-full relative rounded-3xl p-2 bg-gray-100 flex justify-center items-center mx-4 text-white transition-all duration-500`}
      >
        <div className="w-full h-full">
          <Image
            src={dataBanners[indexBanner].src}
            className="w-full h-full object-cover rounded-3xl"
            width={1000}
            height={1000}
            alt="banner"
          />
        </div>
      </div>

      {/* Indicator tombol (kanan) */}
      <div className="absolute right-7 top-10 flex flex-col gap-3 z-20">
        {dataBanners.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndexBanner(i)}
            className={`cursor-pointer h-[12px] w-[12px] rounded-full transition-all duration-300 ${
              indexBanner === i ? "bg-gray-600 h-[40px]" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default MobileBanner;
