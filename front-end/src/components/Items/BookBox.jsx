import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const random = Math.floor(Math.random() * 225)

export default function MovieBox({del, like, divClass, linkClass, imgClass, h1, p, shadow}) {
    const [books, setBooks] = useState([]);
    const isFetched = useRef(false);

    const fetchBooks = async () => {
        const response = await axios.get(`http://localhost:3000/books`);
        setBooks(response.data);
    };

    useEffect(() => {
    if (isFetched.current) return;
    
    fetchBooks()
    
    isFetched.current = true; 
    }, [])

    console.log('books',books)

    return (
            <>
                {
                books.map((book) => (
                    <div key={book.id} className={divClass} >
                        <Link to={`/book/${book.id}`} className={linkClass}>
                            <img src={book.book_cover} alt="" className={imgClass} style={{boxShadow : `${shadow}`}}/>
                            <div>
                                <h1 className={h1}>{book.title}</h1>
                                <p className={p}>{book.author}</p>
                            <p className={`${like} mt-5 md:mt-6 lg:mt-8 md:text-base lg:text-lg`}>{book.price}</p>
                            </div>
                        </Link>
                        <div className={del}>
                            <button onClick={
                                async () => {
                                    await axios.delete(`http://localhost:3000/books/${book.id}`)
                                    fetchBooks()
                                }
                            }>delete</button>
                            <button>
                            <Link to={`/book/edit/${book.id}`}>
                                edit
                            </Link>
                            </button>
                        </div>
                        <div className={`${like} flex flex-col`}>
                            <button className="mt-3 text-red-400 md:text-lg">❤</button>
                            <p className="mt-auto text-orange-400 md:text-base font-semibold mb-5 sm:mb-3">5.0</p>
                        </div>
                    </div>   
                ))
                }
            </>
    )
}