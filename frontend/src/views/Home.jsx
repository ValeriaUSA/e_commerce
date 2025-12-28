import { useState } from "react";
import Filter from "../components/Filter";
import ProductList from "../components/ProductList";

export default function Home() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <main className="main-content">
      <div className="container pt-3">
        <h1 className="h2 mb-4">Book Catalogue</h1>
        <Filter onFilterChange={handleFilterChange} />
        <ProductList
          filters={filters}
          page={page}
          setPage={setPage} 
        />
      </div>
    </main>
  );
}
