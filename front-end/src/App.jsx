import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./components/Home";
import Layout from "./components/Layout";
import "./App.css";

import Book from "./components/BookDetailPage/Book";
import UploadForm from "./components/Items/UploadForm";
import DeleteBook from "./components/Items/DeleteBook";
import EditBook from "./components/Items/EditBook";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/book/upload" element={<UploadForm />} />
          <Route path="/book/delete" element={<DeleteBook />} />
          <Route path="/book/edit/:id" element={<EditBook />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
