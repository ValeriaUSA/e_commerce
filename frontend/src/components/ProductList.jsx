
import { useEffect, useState } from "react";
import axios from "../../axios.config.js";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

// Accept setPage as a direct prop
export default function ProductList({ filters, page, setPage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 5;
  const offset = (page - 1) * limit;

    // ACONSOLE LOGS DEBUGGING
  console.log("ProductList - received page:", page);
  console.log("ProductList - received setPage:", setPage); // Check if it's a function

  useEffect(() => {

      // CONSOLE LOG HERE TO SEE IF USEEFFECT RUNS
    console.log("ProductList - useEffect triggered for page:", page, "and filters:", filters);
    
    setLoading(true);
    setError(""); // Clear previous errors

    axios
      .post("/products/filter", {
        authors: filters.authors || [],
        categories: filters.categories || [],
        minPrice: filters.minPrice || null,
        maxPrice: filters.maxPrice || null,
        limit,
        offset,
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
        console.log("API Request Successful for page:", page, "Response data:", res.data);
      })
      .catch(() => {
        setError("Product list is not available for the moment");
        setLoading(false); // Ensure loading is set to false even on error
        setProducts([]); // Clear products on error
        console.error("API Request Failed for page:", page, "Error:", err);
      });
  }, [filters, page]); // Dependency array: Re-run effect when filters or page changes

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products found matching your criteria.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>

      <Pagination
        page={page}
        setPage={setPage} // Pass the setPage function directly
        hasNext={products.length === limit} // Checks if the number of products received is equal to the limit, indicating there might be more
      />
    </div>
  );
}