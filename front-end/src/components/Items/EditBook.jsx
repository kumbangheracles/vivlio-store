import {React, useState, useEffect} from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function EditBook() {
    const [book, setBook] = useState([]);
    const { id } = useParams()
    const Navigate = useNavigate()
        
    useEffect(() => {
        const fetchBooks = async () => {
            const response = await axios.get(`http://localhost:3000/books/${id}`);
            setBook(response.data);
        };
        
        fetchBooks()
    }, [id])

    const [bookCover, setBookCover] = useState(null)
    // Update input teks
    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    // Update file
    const handleFileChange = (e) => {
        setBookCover(e.target.files[0]);
    };

    // Submit PUT request
    const handleEdit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", book.title);
        formData.append("author", book.author);
        formData.append("price", book.price);
        formData.append("book_type", book.book_type);
        formData.append("book_subType", book.book_subType);
        if (bookCover) {
        formData.append("book_cover", bookCover);
        }

        try {
        const response = await axios.put(
            `http://localhost:3000/books/${id}`,
            formData
        );
        console.log("Updated book:", response.data);
        alert("Book updated successfully!");
        Navigate('/book/delete')
        
        } catch (error) {
        console.error("Update failed:", error);
        alert("Failed to update book.");
        }
    }

    return (
        <section>
            <h1>edit book</h1>

        <form onSubmit={handleEdit}>
            <input
                type="file"
                name="book_cover"
                accept="image/*"
                onChange={handleFileChange}
            />
            <br />
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={book.title}
                onChange={handleChange}
            />
            <br />
            <input
                type="text"
                name="author"
                placeholder="Author"
                value={book.author}
                onChange={handleChange}
            />
            <br />
            <input
                type="text"
                name="price"
                placeholder="Price"
                value={book.price}
                onChange={handleChange}
            />
            <br />
            <input
                type="text"
                name="book_type"
                placeholder="Book Type"
                value={book.book_type}
                onChange={handleChange}
            />
            <br />
            <input
                type="text"
                name="book_subType"
                placeholder="Sub Type"
                value={book.book_subType}
                onChange={handleChange}
            />
            <br />
            <button type="submit">Submit</button>
            </form>
        </section>
    )
}