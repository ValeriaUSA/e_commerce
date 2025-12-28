import React from "react";

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="card mb-3">
      <div className="row g-0">
        {book.imgurl && (
          <div className="col-4">
            <img src={book.imgurl} alt={book.title} className="img-fluid rounded-start" />
          </div>
        )}
        <div className={book.imgurl ? "col-8" : "col-12"}>
          <div className="card-body">
            <h5 className="card-title">{book.title}</h5>
            <p className="card-text">
              <strong>Author:</strong> {book.author} <br />
              <strong>Category:</strong> {book.categoryName} <br />
              <strong>Price:</strong> ${book.price} <br />
              <strong>Quantity:</strong> {book.quantity} <br />
              <strong>Bestseller:</strong> {book.isbestseller ? "Yes" : "No"} <br />
              <strong>Added:</strong> {new Date(book.itemadded).toLocaleDateString()}
            </p>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-info admin-action-btn" onClick={() => onEdit(book)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger admin-action-btn" onClick={() => onDelete(book.productId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

