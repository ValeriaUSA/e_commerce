import { useContext, useRef } from "react";
import { useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

export default function Filter({ onFilterChange }) {
    const { categories, loadingCategories } = useContext(GlobalContext)

    //---States
    const [authors, setAuthors] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    //---Ref to clear author input field easily
    const authorInputRef = useRef(null)

    //---Filter logic
    const applyFilters = () => {
        onFilterChange({
            authors,
            categories: selectedCategories ? [selectedCategories] : [],
            minPrice: minPrice || null,
            maxPrice: maxPrice || null
        });
    };


    //---New Reset logic
    const resetFilters = () => {
        //1. reset all local state var to their initial values
        setAuthors([]);
        setSelectedCategories("");
        setMinPrice("");
        setMaxPrice("");

        //2. explicitely clear the author input field using the ref
        if (authorInputRef.current) {
            authorInputRef.current.value = "";
        }
        //3. trigger the parent component's onFilterChange with empty values
        onFilterChange({
            authors: [],
            categories: [],
            minPrice: null,
            maxPrice: null
        });
    }

    return (

        <div className="book-filter-sidebar card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="literary-heading h5 mb-4">Find your matching book</h2>

                {/* Filter category  */}
                <div className="mb-3">
                    <label className="form-label small fw-bold">Genre</label>

                    <select
                        className="form-select form-select-sm"
                        value={selectedCategories}
                        onChange={(e) => setSelectedCategories(e.target.value)}
                        disabled={loadingCategories}
                    >
                        <option value="">Choose category</option>
                        {categories.map(cat => (
                            <option key={cat.category_id} value={cat.categoryName}> 
                                {cat.categoryName}
                            </option>

                        ))}
                    </select>

                </div>
                {/* Filter author */}
                <div className="mb-3">
                    <label className="form-label small fw-bold">Author</label>
                    <input
                        type="text"
                        placeholder="Autor i search for"
                        className="form-control form-control-sm"
                        ref={authorInputRef} //added for value clear up
                        onBlur={(e) => setAuthors(e.target.value.trim() ? [e.target.value.trim()] : [])}
                    />
                </div>


                {/* Price filtering */}

                <div className="row">
                    <div className="col-6 mb-3">
                        <label className="form-label small fw-bold">Min Price</label>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="form-control form-control-sm"
                        />
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label small fw-bold">Max Price</label>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="form-control form-control-sm"
                        />
                    </div>
                </div>

                {/* Action button */}
                <div className="d-flex justify-content-between pt-2">
                    <button
                        onClick={applyFilters}
                        className="btn btn-sm book-btn-primary flex-fill me-2"
                    >
                        Apply Filters
                    </button>

                    <button
                        onClick={resetFilters}
                        className="btn btn-sm btn-outline-secondary flex-fill"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
}