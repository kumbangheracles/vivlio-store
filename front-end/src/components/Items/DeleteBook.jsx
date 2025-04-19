import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import BookBox from "../Items/BookBox";

export default function DeleteBook() {
    return (
        <section>
            <h1>delete book</h1>
            <div className="w-max">
                <BookBox del="inline" divClass='w-[90vw] content flex' linkClass='flex w-full' imgClass='w-[30%] h-35 justify-self-center'/>
            </div>
        </section>
    )
}