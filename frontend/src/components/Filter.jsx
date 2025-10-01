import { useState } from "react";

export default function Filter({ onFilterChange }) {
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("")


const applyFilters = () => {
    onFilterChange ({
        authors,
        categories,
        minPrice: minPrice ||null,
        maxPrice: maxPrice ||null
    })

}

    return (

        <div className="filters border p-4 rounded-lg mb-6 bg-gray-50">
            <h2 className="text-lg font-bold mb-4">Find your matching book</h2>

            {/* Filter author */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Author</label>
                <input
                    type="text"
                    placeholder="Autor i search for"
                    className="w-full border rounded p-2"
                    onBlur={(e) => setAuthors(e.target.value ? [e.target.value] : [])}
                />
            </div>

            {/* Filter category */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Genre</label>
                <input
                    type="text"
                    placeholder="Genre"
                    className="w-full border rounded p-2"
                    onBlur={(e) => setCategories(e.target.value ? [e.target.value] : [])}
                />
            </div>

            {/* Price filtering */}

            <div className="mb-4">
                <input
                    type="number"
                    placeholder="Starts from"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border rounded p-2"
                />
            </div>

            <div className="mb-4">
                <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border rounded p-2"
                />
            </div>

            <button
                onClick={applyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Filter
            </button>
        </div>
    )

}

