import React from "react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function Book() {
    const {id} = useParams()

    const [book, setBooks] = useState([]);
    
        useEffect(() => {
          const fetchBooks = async () => {
              const response = await axios.get(`http://localhost:3000/books/${id}`);
              setBooks(response.data);
          };
    
          fetchBooks()
        }, [id])
    
        console.log('book',book)
    return (
        <section className="px-5 pt-3">
            <button className="bg-gray-100"><Link to={'/'}>Back</Link></button>
            <div className="flex items-center justify-between pb-5">
                <div>
                    <h1 className="title text-xl font-extrabold mb-1 max-w-[50vw]">{book.title}</h1>
                    <h2 className="text-sm font-medium text-gray-500 mb-1">{book.author}</h2>
                    <h1 className="font-bold text-lg mt-5">{book.price}</h1>
                </div>
                <img src={book.book_cover} className="w-[97px] h-35" alt="" style={{boxShadow : 'rgba(0, 0, 0, 0.5) 2.4px 2.4px 5px'}}/>
            </div>
            <hr />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, nostrum accusamus, similique dolorum nobis sit ducimus molestias ut obcaecati voluptas nulla! Rem cupiditate temporibus labore totam, dolores facilis aspernatur porro!</p>
        </section>
    )
}