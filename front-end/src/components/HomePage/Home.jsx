import React from "react";
import BookBox from "../Items/BookBox";
import Banner from "../Items/Banner";
import Category from "../Items/Catergory";
import Footer from "../Items/Footer";
import bgblue from "../../../public/bgblue2.jpg";

export default function Home() {
  return (
    <section className="overflow-hidden">
        <Banner />

      <h1 className="title text-xl md:text-2xl mx-5 mt-7 md:mx-8 font-extrabold">Categories</h1>
      <Category />

      <section
        className="bg-cover bg-right my-4"
        // style={{ backgroundImage: `url(${bgblue})` }}
      >
        <div className="flex justify-between items-end mx-5 me-4 md:mx-8">
          <h1 className="title text-xl md:text-2xl font-extrabold">
            Recommendation
          </h1>
          <p className="content text-xs font-medium text-blue-400">View more</p>
        </div>
        <div className="overflow-scroll">
          <div className="content flex gap-3 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-13 mx-4 md:mx-7 my-3 w-max ">
            <BookBox
              del="hidden"
              like="hidden text-sm mt-5 text-blue-700 font-bold"
              divClass="w-34 md:w-40 lg:w-43 xl:w-46"
              linkClass="text-center"
              imgClass="w-[90%] h-45 md:h-52 lg:h-55 xl:h-59 justify-self-center rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:brightness-90"
              h1="text-xs sm:text-sm md:text-base font-semibold mt-3"
              p="text-xs md:text-sm font-medium text-gray-500 mt-1"
            />
          </div>
        </div>
      </section>

      <h1 className="title text-xl md:text-2xl mx-5 md:mx-8 title font-extrabold mt-5 mb-3">
        Popular
      </h1>
      <div className="mx-4 md:mx-6 w-full content sm:flex sm:flex-wrap sm:gap-5">
        <BookBox
          del="hidden"
          like="text-sm sm:pe-3 text-blue-700 font-bold"
          divClass="w-[90%] sm:w-[46%] lg:w-[31%] sm:shadow-md flex p-2 mb-3 sm:mb-0 rounded-xl overflow-hidden hover:bg-blue-100"
          linkClass="flex w-full gap-4 md:gap-5 xl:gap-6"
          imgClass="w-23 h-34 sm:w-28 sm:h-40 lg:w-29 lg:h-43 xl:w-32 xl:h-47 rounded-xl shadow-md"
          h1="text-sm/4 sm:text-sm md:text-base font-semibold mt-3"
          p="text-xs md:text-[13px] lg:text-sm font-medium text-gray-500 mt-1"
        />
      </div>

      <Footer />
    </section>
  );
}
