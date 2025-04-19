import React from "react";
import book from "../../../public/category/book (1).png"
import ebook from "../../../public/category/ebook.png"
import fiction from "../../../public/category/fairytale.png"
import nonFiction from "../../../public/category/chemistry.png"
import novel from "../../../public/category/romance.png"
import comic from "../../../public/category/comic-book.png"
import encyclop from "../../../public/category/encyclopedia.png"

const categories = [
    {
        id: 1,
        title:"book",
        img:book,
    },
    {
        id: 2,
        title:"e-book",
        img:ebook,
    },
    {
        id: 3,
        title:"fiction",
        img:fiction,
    },
    {
        id: 4,
        title:"non fiction",
        img:nonFiction,
    },
    {
        id: 5,
        title:"novel",
        img:novel,
    },
    {
        id: 6,
        title:"comic",
        img:comic,
    },
    {
        id: 7,
        title:"encyclopedia",
        img:encyclop,
    },
]

export default function Category() {
    return (
        <section className="overflow-scroll px-5 md:px-8 py-5">
            <section className="w-max flex gap-10 sm:gap-15 md:gap-20 lg:gap-25 xl:gap-28">
            {
                categories.map((category) => (
                    <a key={category.id} href="#" className="text-center w-max flex flex-col items-center">
                        <img src={category.img} alt="" className="w-15 md:w-18 lg:w-19 xl:w-21 mb-2 rounded-lg drop-shadow-md "/>
                        <h1 className="title font-light capitalize text-sm md:text-base">{category.title}</h1>
                    </a>
                ))
            }
            </section>
        </section>
    )
}