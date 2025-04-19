import React from "react";
import banner1 from "../../../public/banner1.jpg"
import banner2 from "../../../public/banner2.jpg"
import banner3 from "../../../public/banner3.jpg"

export default function Banner() {
    return (
        <section className="flex gap-2 md:gap-4 lg:gap-6 mb-5 px-5 md:px-7 lg:px-9 xl:px-10 snap-x snap-mandatory w-full overflow-x-auto">
            <div className="w-[95%] lg:w-[90%] h-[17vh] sm:h-[33vh] md:h-[45vh] lg:h-[55vh] xl:h-[60vh] rounded-xl sm:rounded-3xl xl:rounded-4xl snap-center shrink-0 overflow-hidden" >
                <img src={banner1} alt="" className="object-cover w-full h-full" />
            </div>
            <div className="w-[95%] lg:w-[90%] h-[17vh] sm:h-[33vh] md:h-[45vh] lg:h-[55vh] xl:h-[60vh] rounded-xl sm:rounded-3xl xl:rounded-4xl snap-center shrink-0 overflow-hidden" >
                <img src={banner2} alt="" className="object-cover w-full h-full" />
            </div>
            <div className="w-[95%] lg:w-[90%] h-[17vh] sm:h-[33vh] md:h-[45vh] lg:h-[55vh] xl:h-[60vh] rounded-xl sm:rounded-3xl xl:rounded-4xl snap-center shrink-0 overflow-hidden" >
                <img src={banner3} alt="" className="object-cover w-full h-full" />
            </div>
        </section>
    )
}