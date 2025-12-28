
import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from "../../axios.config.js";
import { FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp } from 'react-icons/fa';
import { debounce } from "lodash" //avoid too many API calls when filters change.


// Const for pagination
const DEFAULT_LIMIT = 10;

const AdminBooks = () => {
    // --- 1. STATE MANAGEMENT ---
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    // state for pages and sorting yable columns
    const [page, setPage] = useState(1);
    const [sortField, setSortField] = useState('itemadded');
    const [sortOrder, setSortOrder] = useState('DESC');

    // state for filtering
    const [filters, setFilters] = useState({
        productId: '',
        author: '',
        title: '',
        categoryName: '',
        isbestseller: '', // 'true', 'false' or ''
        itemadded: '',
    });

    // triggers re-fetching data after adding/updating/deleting a book
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // current book stored in modal form
    const [modalData, setModalData] = useState({
        title: "",
        author: "",
        imgurl: "",
        category_id: "",
        stars: 0,
        reviews: 0,
        price: "", //store as sting, to avoid issues with 'input type="number"
        isbestseller: "false",
        publisheddate: "",
        quantity: 0
    })

    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editBook, setEditBook] = useState(null); //stores the book being edited (null when adding new)


    // --- 2. PAGINATION & SORT CALCULATIONS ---
    const limit = DEFAULT_LIMIT;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalCount / limit);

    // --- 3. HANDLERS ---
    // *** FILTERs handlers ***

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); // reset to page 1
    }, []);

    const handleFilterClear = useCallback(() => {
        setFilters({ author: "", title: "", categoryName: "", isbestseller: "", itemadded: "", productId: "" });
        setPage(1);
    }, []);

    // *** SORTINGs handlers ***

    const handleSortChange = useCallback((field) => {
        setSortField(field);
        setSortOrder(prevOrder =>
            prevOrder === 'ASC' ? 'DESC' : 'ASC'
        );
        setPage(1);
    }, []);

    // returns the appropriate sort icon for the table header.
    const getSortIcon = (field) => {
        if (sortField === field) {
            return sortOrder === 'ASC' ? <FaSortAlphaUp /> : <FaSortAlphaDown />;
        }
        return null;
    };

    // *** PAGESs handlers ***
    const handlePrevPage = useCallback(() => {
        setPage(prev => Math.max(1, prev - 1));
    }, []);

    const handleNextPage = useCallback(() => {
        setPage(prev => Math.min(totalPages, prev + 1));
    }, [totalPages]);


    // *** MODAL form handlers ***
    const openModalForm = (book = null) => {
        setEditBook(book);
     //initiate a form to update/addnew book

        const defaultData = book
            ? {
                ...book,
                isbestseller: String(book.isbestseller),
                publisheddate: book.publisheddate ? book.publisheddate.substring(0, 10) : "",
                price: String(book.price),
                quantity: String(book.quantity),
                category_id: String(book.category_id || ""),
            }
            : {

                title: "",
                author: "",
                imgurl: "",
                category_id: "",
                stars: 0,
                reviews: 0,
                price: "",
                isbestseller: "false",
                publisheddate: "",
                quantity: 0
            };

        setModalData(defaultData);
        setModalOpen(true);
    }
    //close Modal form
    const closeModalForm = () => {
        setModalOpen(false);
        setEditBook(null)
    }
    // handle input update inside Modal form:

    const handleModalFormChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        let newValue = value;

        if (type === "checkbox") {
            newValue = checked;
        } else if (name === "isbestseller") {
            newValue = value;
        }

        setModalData(prev => ({ ...prev, [name]: newValue }));
    }, []);
    //submittig (New/Update) Modal Form

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            //first, prepare data to match the BE requirements:

            const dataToSubmit = {
                ...modalData,
                price: parseFloat(modalData.price),
                quantity: parseInt(modalData.quantity, 10),
                isbestseller: modalData.isbestseller === "true",
            }

            if (editBook) {
                //UPDATE
                await axios.put(`/admin/books/${editBook.productId}`, dataToSubmit);

            } else {
                //ADD NEW
                await axios.post('/admin/books/new', dataToSubmit)
            }

            closeModalForm();
            setRefreshTrigger(prev => prev + 1); //trigger data reload

        } catch (error) {
            console.error("[AdminBooks]: Error saving books: ", error);
            alert(`Error saving book ${error.response?.data?.message || error.message}`)

        }
    }

    // --- DELETE handling ---

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this book from Data Base ?")) return

        try {
            await axios.delete(`/admin/books/${id}`);
            setBooks(books.filter((b) => b.productId !== id)) // remove this book from local state for immediate UI update
        } catch (error) {
            console.error("[AdminBooks] : Error deleting book:", error);
            alert(`Error deleting this book: ${error.response?.data?.message || error.message}`);
        }

    }

    // ---  DATA FETCHING (useEffect) ---

    useEffect(() => {
        axios.get("/products/category")
            .then(res => setCategories(res.data))
            .catch(err => console.error("[FRONT] load categories ERROR:", err));
    }, []); // get categories mapping for modal form. Get it once


    const gettingBooks = async () => {

        setLoading(true);
        setError("");

        try {
            // 🔑 Создание объекта параметров, включая только непустые фильтры
            const params = {
                // Если filters.productId имеет значение (не пустая строка), оно передается как строка
                ...(filters.productId && { productId: filters.productId }),
                ...(filters.author && { author: filters.author }),
                ...(filters.title && { title: filters.title }),
                ...(filters.categoryName && { categoryName: filters.categoryName }),
                // isbestseller передается, если он не пустая строка
                ...(filters.isbestseller !== "" && { isbestseller: filters.isbestseller }),
                ...(filters.itemadded && { itemadded: filters.itemadded }),

                // Пагинация и Сортировка
                limit,
                offset,
                sortField,
                sortOrder,
            };

            const apiRes = await axios.get("/admin", { params });

            // 🔑 ОБНОВЛЕНО: Используем формат ответа бэкенда { books, totalCount }
            setBooks(apiRes.data.books || []);
            setTotalCount(apiRes.data.totalCount || 0);

        } catch (error) {
            console.error("[AdminBooks] : Error loading books : ", error);
            setError("Books could not be loaded: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        const fetchDebounced = debounce(() => {
            gettingBooks();
        }, 700);

        fetchDebounced();

        return () => fetchDebounced.cancel();

    }, [filters, page, sortField, sortOrder, refreshTrigger, limit, offset]);




    // --- 5. RENDER LOGIC ---

    if (loading) return <div className="text-center p-5">Loading books...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container mt-4">
            <h2>📖 Admin Book Management</h2>
            <button onClick={() => openModalForm()} className="btn btn_success">
                Add NEW 📗
            </button>

            {/* --- FILTER BAR --- */}
            <div className="card mb-3 p-3">
                <h5 className="card-title">Filter Books</h5>
                <div className="row g-2">
                    <div className="col-md-3">
                        {/* 🔑 ОБНОВЛЕННЫЙ ФИЛЬТР ПО ID (строка) */}
                        <input
                            type="text"
                            name="productId"
                            value={filters.productId}
                            onChange={handleFilterChange}
                            placeholder="Book ID"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            name="title"
                            value={filters.title}
                            onChange={handleFilterChange}
                            placeholder="Title contains"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            name="author"
                            value={filters.author}
                            onChange={handleFilterChange}
                            placeholder="Choose Author"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            name="categoryName"
                            value={filters.categoryName}
                            onChange={handleFilterChange}
                            placeholder="Choose Category"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            name="isbestseller"
                            value={filters.isbestseller}
                            onChange={handleFilterChange}
                            className="form-select"
                        >
                            <option value=""> Is Best Seller ?</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            name="itemadded"
                            value={filters.itemadded}
                            onChange={handleFilterChange}
                            title="Filter by Added Date"
                            className="form-control"
                        />
                    </div>
                    <button onClick={handleFilterClear} className='btn btn-success'>
                        Clear All Filters
                    </button>
                </div>
            </div>

            {/* --- BOOKS TABLE --- */}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            {/* Заголовки таблицы с сортировкой */}
                            {['productId', 'title', 'author', 'categoryName', 'price', 'quantity', 'isbestseller', 'itemadded'].map(field => (
                                <th
                                    key={field}
                                    onClick={() => handleSortChange(field)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {field.charAt(0).toUpperCase() + field.slice(1)} {getSortIcon(field)}
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.productId}>
                                <td>{book.productId}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.categoryName}</td>
                                <td>${book.price}</td>
                                <td>{book.quantity}</td>
                                <td>{book.isbestseller ? 'Yes' : 'No'}</td>
                                <td>{new Date(book.itemadded).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => openModalForm(book)}
                                        className="btn btn-sm btn-info me-2">Edit</button>
                                    <button
                                        onClick={() => handleDelete(book.productId)}
                                        className="btn btn-sm btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="btn btn-outline-secondary"
                >
                    &laquo; Previous Page
                </button>
                <span>
                    Page **{page}** of **{totalPages}** (Total items: {totalCount})
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={page >= totalPages || totalPages === 0}
                    className="btn btn-outline-secondary"
                >
                    Next Page &raquo;
                </button>
            </div>

            {/* --- MODAL (Add/Update Form) --- */}
            {modalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> {editBook ? "UPDATE BOOK" : "ADD a NEW BOOK"}</h5>
                                <button type="button" className="btn-close" onClick={closeModalForm}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>

                                    {/* Title */}
                                    <div className="mb-3">
                                        <label className="form-label">Title</label>
                                        <input
                                            name="title"
                                            value={modalData.title}
                                            onChange={handleModalFormChange}
                                            placeholder="Title"
                                            className="form-control"
                                        />
                                    </div>
                                    {/* Author */}
                                    <div className="mb-3">
                                        <label className="form-label">Author</label>
                                        <input
                                            name="author"
                                            value={modalData.author}
                                            onChange={handleModalFormChange}
                                            placeholder="Author"
                                            className="form-control"
                                        />
                                    </div>
                                    {/* Category */}
                                    <div className="mb-3">
                                        <label className="form-label">Category</label>
                                        <select
                                            name="category_id"
                                            value={modalData.category_id}
                                            onChange={handleModalFormChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Category</option>

                                            {categories.map(c => (
                                                <option key={c.category_id} value={c.category_id}>
                                                    {c.categoryName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Price */}
                                    <div className="mb-3">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={modalData.price}
                                            onChange={handleModalFormChange}
                                            placeholder="Price"
                                            className="form-control"
                                        />
                                    </div>
                                    {/* Quantity */}
                                    <div className="mb-3">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={modalData.quantity}
                                            onChange={handleModalFormChange}
                                            placeholder="Quantity"
                                            className="form-control"
                                        />
                                    </div>
                                    {/* Bestseller Select */}
                                    <div className="mb-3">
                                        <label className="form-label">Is Bestseller?</label>
                                        <select
                                            name="isbestseller"
                                            value={modalData.isbestseller}
                                            onChange={handleModalFormChange}
                                            className="form-select"
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>
                                    {/* Published Date */}
                                    <div className="mb-3">
                                        <label className="form-label">Published Date</label>
                                        <input
                                            type="date"
                                            name="publisheddate"
                                            value={modalData.publisheddate}
                                            onChange={handleModalFormChange}
                                            className="form-control"
                                        />
                                    </div>
                                    {/* Add other fields here (imgurl, category_id, stars, reviews) */}

                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn btn-secondary" onClick={closeModalForm}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">{editBook ? "Save Changes" : "Add Book"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {modalOpen && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};



export default AdminBooks;