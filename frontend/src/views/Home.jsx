import { useState } from "react";
import Filter from "../components/Filter";
import ProductList from "../components/ProductList";

export default function Home() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // reset to first page when filters change
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Book Catalogue</h1>

      <Filter onFilterChange={handleFilterChange} />

      <ProductList filters={{ ...filters, setPage }} page={page} />
    </div>
  );
}
