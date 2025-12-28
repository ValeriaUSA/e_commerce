import React from "react";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";

const BookTable = ({ books, onEdit, onDelete, sortField, sortOrder, setSortField, setSortOrder }) => {
    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    };

    const getSortIcon = (field) => {
        if (sortField === field) return sortOrder === "ASC" ? <FaSortAlphaUp /> : <FaSortAlphaDown />;
        return null;
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        {["productId", "title", "author", "categoryName", "price", "quantity", "isbestseller", "itemadded"].map((field) => (
                            <th key={field} style={{ cursor: "pointer" }} onClick={() => handleSortChange(field)}>
                                {field.charAt(0).toUpperCase() + field.slice(1)} {getSortIcon(field)}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.productId}>
                            <td>{book.productId}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.categoryName}</td>
                            <td>${book.price}</td>
                            <td>{book.quantity}</td>
                            <td>{book.isbestseller ? "Yes" : "No"}</td>
                            <td>{new Date(book.itemadded).toLocaleDateString()}</td>
                            <td>
                                <div className="d-flex  flex-column gap-1">
                                    <button
                                        className="btn btn-sm btn-info admin-action-btn"
                                        onClick={() => onEdit(book)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger admin-action-btn"
                                        onClick={() => onDelete(book.productId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookTable;
