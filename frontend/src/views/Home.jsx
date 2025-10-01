// import { useState } from "react";
// import Filter from "../components/Filter";
// import ProductList from "../components/ProductList";

// export default function Home() {
//   const [filters, setFilters] = useState({});
//   const [page, setPage] = useState(1);

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//     setPage(1); // reset to first page when filters change
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">Book Catalogue</h1>

//       <Filter onFilterChange={handleFilterChange} />

//       <ProductList filters={{ ...filters, setPage }} page={page} />
//     </div>
//   );
// }

// import { useState } from "react";
// import Filter from "../components/Filter";
// import ProductList from "../components/ProductList";

// export default function Home() {
//   const [filters, setFilters] = useState({});
//   const [page, setPage] = useState(1); // State for current page

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//     setPage(1); // Reset to first page when filters change
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">Book Catalogue</h1>

//       <Filter onFilterChange={handleFilterChange} />

//       {/* Pass page and setPage directly to ProductList */}
//       <ProductList filters={filters} page={page} setPage={setPage} />
//     </div>
//   );
// }

// // Home.jsx (Corrected)
// import { useState } from "react";
// import Filter from "../components/Filter";
// import ProductList from "../components/ProductList";

// export default function Home() {
//   const [filters, setFilters] = useState({});
//   const [page, setPage] = useState(1); // Page state is defined here

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//     setPage(1); // This correctly resets the page to 1 when filters are applied/changed
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">Book Catalogue</h1>

//       <Filter onFilterChange={handleFilterChange} />

//       {/* Pass 'filters', 'page', AND 'setPage' as distinct props to ProductList */}
//       <ProductList
//         filters={filters} // Pass the filters object directly
//         page={page}       // Pass the current page number
//         setPage={setPage} // Pass the setter function for 'page'
//       />
//     </div>
//   );
// }

// Home.jsx
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

  // ADD A CONSOLE LOG HERE
  console.log("Home - current page:", page);
  console.log("Home - setPage function:", setPage); // Check if this is a function

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Book Catalogue</h1>
      <Filter onFilterChange={handleFilterChange} />
      <ProductList
        filters={filters}
        page={page}
        setPage={setPage} 
      />
    </div>
  );
}