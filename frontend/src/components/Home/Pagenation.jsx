import React, { useState } from "react";

const Pagenation = () => {
  // Fake 30 products
  const products = Array.from({ length: 30 }, (_, i) => `Product ${i + 1}`);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Calculate displayed products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handler
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
    
      
      <div className="grid grid-cols-2 gap-4">
        {currentProducts.map((product, index) => (
          <div key={index} className="p-4 border rounded shadow">
            {product}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagenation;