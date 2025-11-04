import axios from "../../axios.config.js";
import { useState, useEffect } from "react";

export default function AdminBooks() {

    // Добавлен totalCount для будущей пагинации (см. секцию DATA from backend)
    const [totalCount, setTotalCount] = useState(0); 
    const [filters, setFilters] = useState({ author: "", title: "", categoryName: "", isbestseller: "", itemadded: "", productId: "" });
    const [page, setPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //Sorting config
    const [sortField, setSortFild] = useState("itemadded"); // by default sorted by dated added to DB
    const [sortOrder, setSortOrder] = useState("DESC");

    //Form data in Add/Update modal
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        imgurl: "",
        category_id: "",
        stars: 0,
        reviews: 0,
        price: "",
        isbestseller: false,
        publisheddate: "",  // YYYY-MM-DD format for input[type="date"]
        quantity: 0
    })

    // Modal management (form for Add/Update)
    const [modalOpen, setModalOpen] = useState(false);
    const [editBook, setEditBook] = useState(null)

    //Pagination limit and offset
    const limit = 10;
    const offset = (page - 1) * limit;

    // Helper для принудительного обновления после CRUD-операций, если не используется сброс состояния
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // ***DATA from backend***

    useEffect(() => {
        //1.Getting from BE and saving books to local state
        const gettingBooks = async () => {
            setLoading(true);
            setError("");

            try {
                const params = {
                    // ИСПРАВЛЕНИЕ 1: Улучшенная логика включения фильтров.
                    // Включаем параметр, только если его значение не является пустой строкой.
                    // Это предотвратит отправку пустых фильтров, если бэкенд не ожидает их.
                    // isbestseller включается, если это не пустая строка ('true', 'false').
                    ...(filters.productId && { productId: filters.productId }),
                    ...(filters.author && { author: filters.author }),
                    ...(filters.title && { title: filters.title }),
                    ...(filters.categoryName && { categoryName: filters.categoryName }),
                    ...(filters.isbestseller !== "" && { isbestseller: filters.isbestseller }),
                    // itemadded - если это дата, она будет truthy. Если пустая строка, то нет.
                    ...(filters.itemadded && { itemadded: filters.itemadded }),
                    
                    limit,
                    offset,
                    sortField,
                    sortOrder,
                };


                const apiRes = await axios.get("/admin/books",
                    { params });

                // ИСПРАВЛЕНИЕ 2: Ожидаем, что бэкенд вернет объект { books: [...], totalCount: N }
                // Если бэкенд возвращает только массив, используйте apiRes.data
                // setBooks(apiRes.data.books || []);
                // setTotalCount(apiRes.data.totalCount || 0);

                // Если ваш BE возвращает просто массив:
                setBooks(apiRes.data || []);
                // Если вы хотите реализовать пагинацию, вам нужно модифицировать BE для возврата totalCount

            } catch (error) {
                console.error("[AdminBooks] : Error loading books : ", error);
                setError("Books could not be loaded")
                console.error("[FRONT🐞] ERROR GET /admin/books :", error.response?.status, error.response?.data);
            } finally {
                setLoading(false)
            }
        };
        // 2. Trigger data get every time filters, page, sort or refresh trigger changes
        gettingBooks();
    }, [filters, page, sortField, sortOrder, refreshTrigger]) // <-- refreshTrigger добавлен сюда


    //***FILTERS HANDLER ***/

    const handleFilterChange = (e) => {
        //update filter dynamically as long as admin types in the field
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1); //need to reset to page 1 if filters change
    }

    const clearFilters = () => {
        //reset filter inputs and page to 1
        setFilters({ author: "", title: "", categoryName: "", isbestseller: "", itemadded: "", productId: "" });
        setPage(1);
    }


    //***SORT HANDLER ***/

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
        } else {
            //if switching to new column  -> default ASC
            setSortFild(field);
            setSortOrder("ASC")
        }
    }

    //display sorting arrow icons
    const renderSortIcon = (field) => {
        if (sortField !== field) return "↔️"
        return sortOrder === "ASC" ? "🔼" : "🔽"
    };


    //***MODAL HANDLER ***/

    const openModalForm = (book = null) => {
        //if updating an existing book, preload its data
        setEditBook(book);
        
        // ИСПРАВЛЕНИЕ 3: При открытии формы для редактирования, 
        // убедитесь, что вы правильно инициализируете formData, особенно isbestseller (булево)
        const initialData = book 
            ? { 
                ...book, 
                // Преобразование из булева (если есть) в строку "true"/"false" для правильного отображения в <select> или checkbox
                isbestseller: book.isbestseller ? "true" : "false",
                // Преобразование даты в формат YYYY-MM-DD для input[type="date"]
                publisheddate: book.publisheddate ? book.publisheddate.substring(0, 10) : ""
              } 
            : { 
                title: "", 
                author: "", 
                imgurl: "", 
                category_id: "", 
                stars: 0, 
                reviews: 0, 
                price: "", 
                isbestseller: false, // Для новой книги по умолчанию false
                publisheddate: "", 
                quantity: 0 
              };

        setFormData(initialData);
        setModalOpen(true);
    }


    const closeModalForm = () => {
        setModalOpen(false);
        setEditBook(null); // Сбросить редактируемую книгу при закрытии
        // setBooks(null); // <-- Удалил: не нужно сбрасывать список книг при закрытии модального окна
    }

    //*Handle input chanches inside Modal Form

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // ИСПРАВЛЕНИЕ 4: Правильная обработка логических (булевых) полей (isbestseller)
        let newValue = value;
        if (type === "checkbox") {
            newValue = checked;
        } else if (name === "isbestseller") {
             // Преобразование строкового значения 'true'/'false' из <select> в булево
            newValue = value === "true";
        }

        setFormData({ ...formData, [name]: newValue });
    }

    //*Submitting (New/Update) Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 5. Подготовка данных: цена и количество должны быть числами, если вы отправляете их в бэкенд
            const dataToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10),
                isbestseller: formData.isbestseller === "true" || formData.isbestseller === true, // Убедитесь, что это булево
                // Добавьте логику для форматирования publisheddate, если ваш BE ее требует
            };

            if (editBook) {
                // UPDATE
                await axios.put(`/admin/books/${editBook.productId}`, dataToSubmit);
            } else {
                // CREATE
                await axios.post('/admin/books', dataToSubmit)
            }
            
            // close modal after saving
            closeModalForm();
            // ИСПРАВЛЕНИЕ 6: Вместо ручного обновления, просто триггерните useEffect через refreshTrigger
            setRefreshTrigger(prev => prev + 1);

        } catch (error) {
            console.error("[AdminBooks] : Error saving books : ", error);
            alert(`Error saving book: ${error.response?.data?.message || error.message}`)
        }
    };


    //*Delete a book

    // ИСПРАВЛЕНИЕ 7: Вынесите handleDelete из handleSubmit. 
    // Функции не должны быть вложенными таким образом.
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this book from Data Base?")) return
        try {
            // ИСПРАВЛЕНИЕ 8: Удалите лишнюю закрывающую скобку '}' из URL
            await axios.delete(`/admin/books/${id}`);
            //remove deleted book from local state (faster UI)
            setBooks(books.filter((b) => b.productId !== id));
        } catch (error) {
            console.error("[AdminBooks] : Error deleting book : ", error);
            alert(`Error deleting this book: ${error.response?.data?.message || error.message}`)
        }
    };
    

    //******************************** */
    return (

        <div className="p-4">
            {/* container w padding p-4 */}

            {/* HEADER + ADD BTN */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                {/* flex container  fo Header + ADD button, margin botton 3 */}

                <h2 className="h4"> BOOK MANAGEMENT</h2>
                <button onClick={() => openModalForm()} className="btn btn-success">
                    Add New Book
                </button>
            </div>
            {/* FILTER BAR */}
            <div className="d-flex flew-wrap gap-2 mb-3">
                {/* wrap input if screen is too small, gap spasing btwn items */}


                <input
                    type="text"
                    name="productId"
                    value={filters.productId}
                    onChange={handleFilterChange}
                    placeholder="Filter by Book ID"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
                <input
                    type="text"
                    name="author"
                    value={filters.author}
                    onChange={handleFilterChange}
                    placeholder="Filter by Author"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
                <input
                    type="text"
                    name="categoryName"
                    value={filters.categoryName}
                    onChange={handleFilterChange}
                    placeholder="Filter by Category"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
                <input
                    type="text"
                    name="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    placeholder="Filter by Book Title"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
                <input
                    type="date"
                    name="itemadded"
                    value={filters.itemadded}
                    onChange={handleFilterChange}
                    placeholder="Filter Date of  DB entry"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                />
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

            {/* DATA TABLT */}

            {loading && <div className="text-center text-primary">Loading books...</div>}
            {error && <div className="text-center text-danger">Error: {error}</div>}

            <table className="table table-bordered table-hover"> {/* ИСПРАВЛЕНИЕ: typo tavle -> table */}
                {/* hilight row on hover */}
                <thead className="table-light">
                    {/* light background for table header */}
                    <tr>
                        {/* ИСПРАВЛЕНИЕ 9: Добавьте onClick обработчики для сортировки */}
                        <th onClick={() => handleSort("productId")}>ID {renderSortIcon("productId")}</th>
                        <th onClick={() => handleSort("author")}>Author {renderSortIcon("author")}</th>
                        <th>Category</th> {/* Не сортируете по categoryName? */}
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
                            <td>{b.itemadded}</td>
                            <td className="text-center">{b.isbestseller ? "✅" : "❌"}</td>
                            <td>EUR{b.price}</td>
                            <td>{b.quantity}</td>
                            <td className="text-center">
                                {/* ИСПРАВЛЕНИЕ 10: Добавьте обработчик для UPDATE */}
                                <button 
                                    onClick={() => openModalForm(b)} 
                                    className="btn btn-link btn-sm text-primary me-2" // ИСПРАВЛЕНИЕ: typo bnt-sm -> btn-sm
                                >
                                    UPDATE
                                </button>
                                {/* ИСПРАВЛЕНИЕ 11: Добавьте обработчик для DELETE */}
                                <button 
                                    onClick={() => handleDelete(b.productId)} 
                                    className="btn btn-link btn-sm text-danger me-2" // ИСПРАВЛЕНИЕ: typo bnt-sm -> btn-sm
                                >
                                    DELETE
                                </button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>

            {/* ПАГИНАЦИЯ (NEXT/PREV) - ВЫ ДОБАВИТЕ СЮДА ПОСЛЕ РЕАЛИЗАЦИИ totalCount */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                {/* Кнопки пагинации и информация о странице */}
            </div>


            {/* MODAL */}

            {modalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    {/* show modal to display, d-block  */}
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> {editBook ? "UPDATE BOOK" : "ADD a NEW BOOK"}</h5>
                                <button type="button" className="btn-close" onClick={closeModalForm}>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Добавьте все поля формы сюда */}
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
                                    <div className="mb-3">
                                        <label className="form-label">Is Bestseller?</label>
                                        <select
                                            name="isbestseller"
                                            // ИСПРАВЛЕНИЕ 12: Значение должно быть строкой 'true'/'false' для <select>
                                            value={formData.isbestseller.toString()}
                                            onChange={handleFormChange}
                                            className="form-select"
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>
                                    {/* ... другие поля (imgurl, category_id, stars, reviews, publisheddate) */}
                                    
                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn btn-secondary" onClick={closeModalForm}>Cancel</button>
                                        {/* ИСПРАВЛЕНИЕ 13: Установите type="submit" для кнопки сохранения в форме */}
                                        <button type="submit" className="btn btn-primary">{editBook ? "Save" : "Add"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {modalOpen && <div className="modal-backdrop fade show"></div>} {/* Добавление затемнения для модального окна */}
        </div>
    );
}