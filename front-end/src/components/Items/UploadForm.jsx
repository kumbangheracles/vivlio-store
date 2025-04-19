import React, { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [data, setData] = useState({
    title: "",
    author: "",
    price: "",
    book_type: "",
    book_subType: "",
  });

  const [bookCover, setBookCover] = useState(null);

  // Handle perubahan input teks
  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle perubahan input file
  const handleFileChange = (e) => {
    setBookCover(e.target.files[0]);
  };

  const upload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("price", data.price);
    formData.append("book_type", data.book_type);
    formData.append("book_subType", data.book_subType);
    if (bookCover) {
      formData.append("book_cover", bookCover);
    }

    try {
      const response = await axios.post("http://localhost:3000/books", formData);
      console.log("Response:", response.data);
      alert("Book uploaded successfully!");

      setData({
        title: "",
        author: "",
        price: "",
        book_type: "",
        book_subType: "",
      });
      // Reset state file
      setBookCover(null);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  return (
    <form onSubmit={upload}>
      <h1>Upload Book</h1>
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
        value={data.title}
        onChange={handleInput}
      />
      <br />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={data.author}
        onChange={handleInput}
      />
      <br />
      <input
        type="text"
        name="price"
        placeholder="Price"
        value={data.price}
        onChange={handleInput}
      />
      <br />
      <input
        type="text"
        name="book_type"
        placeholder="Book Type"
        value={data.book_type}
        onChange={handleInput}
      />
      <br />
      <input
        type="text"
        name="book_subType"
        placeholder="Sub Type"
        value={data.book_subType}
        onChange={handleInput}
      />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
