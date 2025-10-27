import { useEffect, useState } from "react";

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
    },
    {
      id: 2,
      title: "Banner 2",
      backgroundColor: "bg-yellow-500",
    },
    {
      id: 3,
      title: "Banner 3",
      backgroundColor: "bg-red-500",
    },
    {
      id: 4,
      title: "Banner 4",
      backgroundColor: "bg-green-500",
    },
  ];

  useEffect(() => {
    console.log("Index banner: ", indexBanner);
  }, [indexBanner]);

  return (
    <div className="relative w-screen h-[200px] overflow-hidden">
      {/* Banner aktif */}
      <div
        className={`p-4 ${dataBanners[indexBanner].backgroundColor} h-full rounded-3xl flex justify-center items-center mx-4 text-white transition-all duration-500`}
      >
        <span className="text-2xl font-bold">
          {dataBanners[indexBanner].title}
        </span>
      </div>

      {/* Indicator tombol (kanan) */}
      <div className="absolute right-7 top-10 flex flex-col gap-3 z-20">
        {dataBanners.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndexBanner(i)}
            className={`cursor-pointer h-[12px] w-[12px] rounded-full transition-all duration-300 ${
              indexBanner === i ? "bg-white h-[40px]" : "bg-white/50"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default MobileBanner;
