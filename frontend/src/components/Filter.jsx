import { useContext } from "react";
import { useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

export default function Filter({ onFilterChange }) {
    const { categories, loadingCategories } = useContext(GlobalContext)


    const [authors, setAuthors] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("")


    const applyFilters = () => {
        onFilterChange({
            authors,
            categories: selectedCategories ? [selectedCategories] : [],
            minPrice: minPrice || null,
            maxPrice: maxPrice || null
        })

    }

    return (

        <div className="filters border p-4 rounded-lg mb-6 bg-gray-50">
            <h2 className="text-lg font-bold mb-4">Find your matching book</h2>


            {/* Filter category  */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Genre</label>
                <select
                value ={selectedCategories}
                onChange ={(e) => setSelectedCategories(e.target.value)}
                disabled ={loadingCategories}
                >
<option value = "">Choose category</option>
{categories.map(cat => (
    <option  key = {cat.category_id}>
    {cat.categoryName}
    </option>

))}
                </select>
                    
            </div>
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

