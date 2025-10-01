import { useEffect, useState } from "react";
import axios from "../../axios.config.js";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

export default function ProductList({ filters, page }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 12;
  const offset = (page - 1) * limit;

  useEffect(() => {
    setLoading(true);

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
      })
      .catch(() => setError("Product list is not available for the moment"));
  }, [filters, page]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>

      <Pagination
        page={page}
        setPage={(newPage) => filters.setPage(newPage)} // pass setter from homepage
        hasNext={products.length === limit} // naive check
      />
    </div>
  );
}
