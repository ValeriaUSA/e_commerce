import axios from "../../../axios.config";
import { useState, useEffect } from "react";

const BookModal = ({ book, categories, onClose, onSaved }) => {
    const [modalData, setModalData] = useState({
        title: "",
        author: "",
        imgurl: "",
        category_id: "",
        stars: 0,
        reviews: 0,
        price: "",
        isbestseller: "false",
        publisheddate: "",
        quantity: 0,
    });

    useEffect(() => {
        if (book) {
            setModalData({
                ...book,
                imgurl: book.imgurl || "",
                category_id: book.category_id ? String(book.category_id) : "",
                price: String(book.price || ""),
                quantity: String(book.quantity || ""),
                isbestseller: String(book.isbestseller),
                publisheddate: book.publisheddate ? book.publisheddate.substring(0, 10) : "",
            });
        } else {
            setModalData({
                title: "",
                author: "",
                imgurl: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`,
                category_id: "",
                stars: 0,
                reviews: 0,
                price: "",
                isbestseller: "false",
                publisheddate: "",
                quantity: 0,
            });
        }
    }, [book]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "quantity") {
            // allow empty string while typing
            if (/^\d*$/.test(value)) {
                setModalData(prev => ({ ...prev, quantity: value }));
            }
            return;
        }

        setModalData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const quantityInt = Math.max(0, parseInt(modalData.quantity, 10) || 0);
            const dataToSubmit = {
                ...modalData,
                price: parseFloat(modalData.price),
                quantity: quantityInt,
                isbestseller: modalData.isbestseller === "true",
            };

            if (book) {
                await axios.put(`/admin/books/${book.productId}`, dataToSubmit);
            } else {
                await axios.post("/admin/books/new", dataToSubmit);
            }

            onSaved();
            onClose();
        } catch (err) {
            alert(`Error saving book: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{book ? "Update Book" : "Add New Book"}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input name="title" value={modalData.title} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Author</label>
                                    <input name="author" value={modalData.author} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Image URL</label>
                                    <input name="imgurl" value={modalData.imgurl} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <select name="category_id" value={modalData.category_id} onChange={handleChange} className="form-select">
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.category_id} value={c.category_id}>{c.categoryName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Price</label>
                                    <input type="number" name="price" value={modalData.price} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Quantity</label>
                                    <input type="number" name="quantity" value={modalData.quantity} onChange={handleChange} className="form-control" min="0" step="1" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Is Bestseller?</label>
                                    <select name="isbestseller" value={modalData.isbestseller} onChange={handleChange} className="form-select">
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Published Date</label>
                                    <input type="date" name="publisheddate" value={modalData.publisheddate} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{book ? "Save Changes" : "Add Book"}</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookModal;

