import React from "react";
import logo from "../../../public/vivlio-type-white.png"

export default function Footer() {
    return (
        <section className="content bg-[#487dba] font-light text-xs sm:text-sm text-white capitalize mt-19 px-5 md:px-8 md:pt-11 pt-7 grid grid-rows-2 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-3 md:gap-7">
            <div className="flex flex-col justify-center lg:row-span-2">
                <img src={logo} alt="" className="w-25 mb-3" />
                <p className="normal-case">Email: vivlio.store@gmail.com</p>
                <p>tel: +62 812 3456 7890</p>
            </div>

            <div className="flex gap-19 items-center md:row-start-2 lg:row-start-1 lg:col-start-2 lg:row-span-2">
                <div>
                    <p>about us</p>
                    <p>corporate information</p>
                    <p>store information</p>
                </div>
                <div>
                    <p className="uppercase">faq</p>
                    <p>help</p>
                </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2 md:col-span-2 md:row-span-2 lg:col-span-1 lg:row-span-2">
                <iframe className="w-[40%] h-30 rounded-md" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5163332423226!2d106.6318419744096!3d-6.195397060694145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f92f1c580343%3A0xe46d6a860cce25ec!2sUniversitas%20Raharja!5e0!3m2!1sen!2sid!4v1744893065889!5m2!1sen!2sid" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                <p>address: 
                    <br />
                    Modern, Jl. Jenderal Sudirman No.40, Cikokol, Kec. Tangerang, Kota Tangerang, Banten 15117</p>
            </div>

            <div className="mt-5 gap-3 sm:col-span-2 md:col-span-3 grid grid-rows-auto md:grid-cols-2 h-max">
                <hr className="md:col-span-2 md:col-start-1" />
                <div className="flex justify-center md:justify-end text-center gap-5 md:col-start-2 md:row-start-2">
                    <p>terms & condition</p>
                    <p>|</p>
                    <p>privacy policy</p>
                    <p>|</p>
                    <p>site preview</p>
                </div>
                <p className="text-center md:text-start font-medium lg:mb-3 md:col-start-1 md:row-start-2">copyright &copy; 2025</p>
            </div>

        </section>
    )
}