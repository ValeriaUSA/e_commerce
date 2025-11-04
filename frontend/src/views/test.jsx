import axios from "../../axios.config.js";
import { useState, useEffect } from "react";


export default function AdminBooks() {

    // --- State Management ---
    const [totalCount, setTotalCount] = useState(0); 
    const [filters, setFilters] = useState(
        { author: "", 
            title: "", 
            categoryName: "", 
            isbestseller: "", 
            itemadded: "", 
            productId: "" });
    const [page, setPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Sorting config
    const [sortField, setSortFild] = useState("itemadded"); 
    const [sortOrder, setSortOrder] = useState("DESC");

    // Form data for Add/Update modal
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        imgurl: "",
        category_id: "",
        stars: 0,
        reviews: 0,
        price: "", // Храним как строку, чтобы избежать проблем с 'input type="number"'
        isbestseller: "false", // Храним как строку "true"/"false" для <select>
        publisheddate: "", 
        quantity: 0
    });

    // Modal management
    const [modalOpen, setModalOpen] = useState(false);
    const [editBook, setEditBook] = useState(null); 

    // Pagination
    const limit = 10;
    const offset = (page - 1) * limit;

    // Helper для принудительного обновления после CRUD-операций
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // *** DATA from backend (useEffect) ***

    useEffect(() => {
        const gettingBooks = async () => {
            setLoading(true);
            setError("");

            try {
                // 🔑 Улучшенная логика включения фильтров (используя синтаксис &&)
                const params = {
                    // Используем short-circuiting: если filters.X truthy (не пустая строка),
                    // то вернется { X: value }, которое затем спредится.
                    ...(filters.productId && { productId: filters.productId }),
                    ...(filters.author && { author: filters.author }),
                    ...(filters.title && { title: filters.title }),
                    ...(filters.categoryName && { categoryName: filters.categoryName }),
                    
                    // isbestseller: включается, если это не пустая строка ('true', 'false').
                    ...(filters.isbestseller !== "" && { isbestseller: filters.isbestseller }),
                    
                    ...(filters.itemadded && { itemadded: filters.itemadded }),
                    
                    limit,
                    offset,
                    sortField,
                    sortOrder,
                };

                const apiRes = await axios.get("/admin/books", { params });

                // 🔑 ВАЖНО: Мы ожидаем, что бэкенд возвращает только массив объектов.
                setBooks(apiRes.data || []);
                // setTotalCount(apiRes.data.length); // Используйте, если нет серверного подсчета

            } catch (error) {
                console.error("[AdminBooks] : Error loading books : ", error);
                setError("Books could not be loaded");
                console.error("[FRONT🐞] ERROR GET /admin/books :", error.response?.status, error.response?.data);
            } finally {
                setLoading(false);
            }
        };
        gettingBooks();
    }, [filters, page, sortField, sortOrder, refreshTrigger]); 


    //*** FILTERS HANDLER ***/

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1); // Сброс на страницу 1 при изменении фильтров
    }

    const clearFilters = () => {
        setFilters({ author: "", title: "", categoryName: "", isbestseller: "", itemadded: "", productId: "" });
        setPage(1);
    }


    //*** SORT HANDLER ***/

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
        } else {
            setSortFild(field);
            setSortOrder("ASC") // Сортировка по возрастанию при смене колонки
        }
    }

    // Display sorting arrow icons
    const renderSortIcon = (field) => {
        if (sortField !== field) return "↔️"
        return sortOrder === "ASC" ? "🔼" : "🔽"
    };


    //*** MODAL HANDLER ***/

    const openModalForm = (book = null) => {
        setEditBook(book);
        
        // 🔑 Инициализация формы для редактирования/создания
        const initialData = book 
            ? { 
                ...book, 
                // isbestseller: булево -> строка 'true'/'false' для <select>
                isbestseller: String(book.isbestseller),
                // Преобразование даты в формат YYYY-MM-DD
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
                isbestseller: "false", // По умолчанию "false" строкой
                publisheddate: "", 
                quantity: 0 
              };

        setFormData(initialData);
        setModalOpen(true);
    }


    const closeModalForm = () => {
        setModalOpen(false);
        setEditBook(null); 
    }

    //* Handle input changes inside Modal Form

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        let newValue = value;

        // Обработка булевых полей и чисел (храним строку для удобства)
        if (type === "checkbox") {
            newValue = checked;
        } else if (name === "isbestseller") {
            // Оставляем как строку 'true'/'false' из <select>
            newValue = value; 
        }

        setFormData({ ...formData, [name]: newValue });
    }

    //* Submitting (New/Update) Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 🔑 Подготовка данных: преобразование строковых значений в числа/булевы для бэкенда
            const dataToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10),
                // Преобразование строки 'true'/'false' из <select> в булево
                isbestseller: formData.isbestseller === "true", 
            };

            if (editBook) {
                // UPDATE
                await axios.put(`/admin/books/${editBook.productId}`, dataToSubmit);
            } else {
                // CREATE
                await axios.post('/admin/books', dataToSubmit);
            }
            
            closeModalForm();
            // 🔑 Триггер для перезагрузки данных
            setRefreshTrigger(prev => prev + 1);

        } catch (error) {
            console.error("[AdminBooks] : Error saving books : ", error);
            alert(`Error saving book: ${error.response?.data?.message || error.message}`);
        }
    };


    //* Delete a book

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this book from Data Base?")) return;
        try {
            await axios.delete(`/admin/books/${id}`);
            // Удаляем из локального состояния для мгновенного обновления UI
            setBooks(books.filter((b) => b.productId !== id));
        } catch (error) {
            console.error("[AdminBooks] : Error deleting book : ", error);
            alert(`Error deleting this book: ${error.response?.data?.message || error.message}`);
        }
    };
    

    //******************************** */
    return (

        <div className="p-4">
            
            {/* HEADER + ADD BTN */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4"> BOOK MANAGEMENT</h2>
                <button onClick={() => openModalForm()} className="btn btn-success">
                    Add New Book
                </button>
            </div>
            
            {/* FILTER BAR */}
            <div className="d-flex flew-wrap gap-2 mb-3">
                {/* Product ID Filter */}
                <input
                    type="text"
                    name="productId"
                    value={filters.productId}
                    onChange={handleFilterChange}
                    placeholder="Filter by Book ID"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
                {/* Author Filter */}
                <input
                    type="text"
                    name="author"
                    value={filters.author}
                    onChange={handleFilterChange}
                    placeholder="Filter by Author"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
                {/* Category Filter */}
                <input
                    type="text"
                    name="categoryName"
                    value={filters.categoryName}
                    onChange={handleFilterChange}
                    placeholder="Filter by Category"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
                {/* Title Filter */}
                <input
                    type="text"
                    name="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    placeholder="Filter by Book Title"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
                {/* Date Added Filter */}
                <input
                    type="date"
                    name="itemadded"
                    value={filters.itemadded}
                    onChange={handleFilterChange}
                    placeholder="Filter Date of  DB entry"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
                {/* Bestseller Filter (Select) */}
                <select
                    name="isbestseller"
                    value={filters.isbestseller}
                    onChange={handleFilterChange}
                    className="form-select"
                    style={{ maxWidth: '100px' }}
                >
                    <option value="">All</option>
                    <option value="true">Best Seller</option>
                    <option value="false">Non-bestseller</option>
                </select>
                <button onClick={clearFilters} className="btn btn-success">
                    Clear All Filters
                </button>
            </div>

            {/* DATA TABLE */}

            {loading && <div className="text-center text-primary">Loading books...</div>}
            {error && <div className="text-center text-danger">Error: {error}</div>}

            <table className="table table-bordered table-hover"> 
                <thead className="table-light">
                    <tr>
                        <th onClick={() => handleSort("productId")}>ID {renderSortIcon("productId")}</th>
                        <th onClick={() => handleSort("author")}>Author {renderSortIcon("author")}</th>
                        <th onClick={() => handleSort("categoryName")}>Category {renderSortIcon("categoryName")}</th> 
                        <th onClick={() => handleSort("title")}>Title {renderSortIcon("title")}</th>
                        <th onClick={() => handleSort("itemadded")}>Added at {renderSortIcon("itemadded")}</th>
                        <th onClick={() => handleSort("isbestseller")}>Bestseller {renderSortIcon("isbestseller")}</th>
                        <th onClick={() => handleSort("price")}>Price {renderSortIcon("price")}</th>
                        <th onClick={() => handleSort("quantity")}>Quantity {renderSortIcon("quantity")}</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map((b) => (
                        <tr key={b.productId}>
                            <td>{b.productId}</td>
                            <td>{b.author}</td>
                            <td>{b.categoryName}</td>
                            <td>{b.title}</td>
                            <td>{b.itemadded ? new Date(b.itemadded).toLocaleDateString() : 'N/A'}</td>
                            <td className="text-center">{b.isbestseller ? "✅" : "❌"}</td>
                            <td>EUR {b.price}</td>
                            <td>{b.quantity}</td>
                            <td className="text-center">
                                {/* UPDATE Button */}
                                <button 
                                    onClick={() => openModalForm(b)} 
                                    className="btn btn-link btn-sm text-primary me-2"
                                >
                                    UPDATE
                                </button>
                                {/* DELETE Button */}
                                <button 
                                    onClick={() => handleDelete(b.productId)} 
                                    className="btn btn-link btn-sm text-danger me-2"
                                >
                                    DELETE
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination controls will go here */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                {/* Pagination (Page, Next, Prev) */}
            </div>


            {/* MODAL (Add/Update Form) */}

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
                                            value={formData.title}
                                            onChange={handleFormChange}
                                            placeholder="Title"
                                            className="form-control"
                                        />
                                    </div>
                                    {/* Author */}
                                    <div className="mb-3">
                                        <label className="form-label">Author</label>
                                        <input
                                            name="author"
                                            value={formData.author}
                                            onChange={handleFormChange}
                                            placeholder="Author"
                                            className="form-control"
                                        />
                                    </div>
                                    {/* Price */}
                                    <div className="mb-3">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleFormChange}
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
                                            value={formData.quantity}
                                            onChange={handleFormChange}
                                            placeholder="Quantity"
                                            className="form-control"
                                        />
                                    </div>
                                    {/* Bestseller Select */}
                                    <div className="mb-3">
                                        <label className="form-label">Is Bestseller?</label>
                                        <select
                                            name="isbestseller"
                                            value={formData.isbestseller} 
                                            onChange={handleFormChange}
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
                                            value={formData.publisheddate}
                                            onChange={handleFormChange}
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
}


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from "../../axios.config.js";
import { FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp } from 'react-icons/fa';

// Константы для пагинации
const DEFAULT_LIMIT = 10;

const AdminBooks = () => {
    // --- 1. STATE MANAGEMENT ---
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    // Состояние пагинации и сортировки
    const [page, setPage] = useState(1);
    const [sortField, setSortField] = useState('itemadded');
    const [sortOrder, setSortOrder] = useState('DESC');

    // Состояние фильтров
    const [filters, setFilters] = useState({
        productId: '',
        author: '',
        title: '',
        categoryName: '',
        isbestseller: '', // Строка, может быть 'true', 'false' или ''
        itemadded: '',
    });

    // Дополнительный триггер для обновления данных (например, после создания/обновления)
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // --- 2. PAGINATION & SORT CALCULATIONS ---
    const limit = DEFAULT_LIMIT;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalCount / limit);

    // --- 3. HANDLERS ---

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); // Сброс на первую страницу при изменении фильтра
    }, []);

    const handleSortChange = useCallback((field) => {
        setSortField(field);
        setSortOrder(prevOrder => 
            prevOrder === 'ASC' ? 'DESC' : 'ASC'
        );
        setPage(1); // Сброс на первую страницу при изменении сортировки
    }, []);

    const handlePrevPage = useCallback(() => {
        setPage(prev => Math.max(1, prev - 1));
    }, []);

    const handleNextPage = useCallback(() => {
        setPage(prev => Math.min(totalPages, prev + 1));
    }, [totalPages]);

    // Функция для отображения иконки сортировки
    const getSortIcon = (field) => {
        if (sortField === field) {
            return sortOrder === 'ASC' ? <FaSortAlphaUp /> : <FaSortAlphaDown />;
        }
        return null;
    };

    // --- 4. DATA FETCHING (useEffect) ---
    useEffect(() => {
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
        gettingBooks();
    }, [filters, page, sortField, sortOrder, refreshTrigger, limit, offset]);
    // В список зависимостей добавлены limit и offset, чтобы обеспечить срабатывание при изменении страницы/лимита

    // --- 5. RENDER LOGIC ---

    if (loading) return <div className="text-center p-5">Loading books...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container mt-4">
            <h2>📚 Admin Book Management</h2>

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
                            placeholder="Filter by Exact Book ID"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            name="title"
                            value={filters.title}
                            onChange={handleFilterChange}
                            placeholder="Filter by Title (Partial)"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            name="author"
                            value={filters.author}
                            onChange={handleFilterChange}
                            placeholder="Filter by Author"
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
                            <option value="">Best Seller (Any)</option>
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
                <button className="btn btn-sm btn-info me-2">Edit</button>
                <button className="btn btn-sm btn-danger">Delete</button>
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
        </div>
    );
};