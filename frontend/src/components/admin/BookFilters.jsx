import React from "react";

const BookFilters = ({ filters, setFilters, categories }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      productId: "",
      title: "",
      author: "",
      categoryName: "",
      isbestseller: "",
      itemadded: "",
    });
  };

  return (
    <div className="card p-3 mb-3">
      <h5 className="card-title">Filter Books</h5>
      <div className="row g-2 align-items-end">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            name="productId"
            placeholder="Book ID"
            value={filters.productId}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="Title"
            value={filters.title}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            name="author"
            placeholder="Author"
            value={filters.author}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="categoryName"
            value={filters.categoryName}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories?.map((c) => (
              <option key={c.category_id} value={c.categoryName}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="isbestseller"
            value={filters.isbestseller}
            onChange={handleChange}
          >
            <option value="">Is Bestseller?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            name="itemadded"
            value={filters.itemadded}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-12 mt-2">
          <button className="btn btn-success" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookFilters;



