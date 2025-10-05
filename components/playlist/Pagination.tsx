
import React from 'react';
import { Icon, ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers.map((num, index) =>
      typeof num === 'number' ? (
        <button
          key={index}
          onClick={() => handlePageChange(num)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === num
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          {num}
        </button>
      ) : (
        <span key={index} className="px-3 py-1 text-sm text-gray-500">...</span>
      )
    );
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>Entries per page</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon svg={ChevronLeftIcon} className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
           <Icon svg={ChevronRightIcon} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
