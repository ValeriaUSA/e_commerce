import { useState, useEffect, useCallback } from "react";
import axios from "../../axios.config.js";
import { debounce } from "lodash";

import BookTable from "../components/admin/BookTable.jsx";
import BookCard from "../components/admin/BookCard";
import BookFilters from "../components/admin/BookFilters";
import BookModal from "../components/admin/BookModal";


const DEFAULT_LIMIT = 10;

const BooksAdmin = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    productId: "", title: "", author: "", categoryName: "", isbestseller: "", itemadded: ""
  });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState("itemadded");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const limit = DEFAULT_LIMIT;
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    axios.get("/products/category").then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const fetchBooks = async () => {
    setLoading(true); setError("");
    try {
      const params = {
        ...(filters.productId && { productId: filters.productId }),
        ...(filters.title && { title: filters.title }),
        ...(filters.author && { author: filters.author }),
        ...(filters.categoryName && { categoryName: filters.categoryName }),
        ...(filters.isbestseller !== "" && { isbestseller: filters.isbestseller }),
        ...(filters.itemadded && { itemadded: filters.itemadded }),
        limit, offset, sortField, sortOrder
      };
      const res = await axios.get("/admin", { params });
      setBooks(res.data.books || []); setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      setError(err.message || "Failed to load books");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const debounced = debounce(fetchBooks, 600);
    debounced();
    return () => debounced.cancel();
  }, [filters, page, sortField, sortOrder, refreshTrigger]);

  const openModal = (book = null) => { setEditBook(book); setModalOpen(true); };
  const closeModal = () => { setEditBook(null); setModalOpen(false); };
  const handleDelete = async (id) => { if (!window.confirm("Delete this book?")) return; await axios.delete(`/admin/books/${id}`); setRefreshTrigger(p => p + 1); };

  if (loading) return <div className="text-center p-5">Loading…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container admin-books-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📖 Admin Book Management</h2>
        <button className="btn btn-success" onClick={() => openModal()}>Add New Book</button>
      </div>

      <BookFilters filters={filters} setFilters={setFilters} categories={categories} />

      {/* Desktop Table */}
      <div className="d-none d-md-block">
        <BookTable
          books={books}
          onEdit={openModal}
          onDelete={handleDelete}
          sortField={sortField}
          sortOrder={sortOrder}
          setSortField={setSortField}
          setSortOrder={setSortOrder}
        />
      </div>

      {/* Mobile / Tablet Cards */}
      <div className="d-md-none">
        {books.map(book => (
          <BookCard key={book.productId} book={book} onEdit={openModal} onDelete={handleDelete} />
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {modalOpen && <BookModal book={editBook} categories={categories} onClose={closeModal} onSaved={() => setRefreshTrigger(p => p + 1)} />}
    </div>
  );
};

export default BooksAdmin;