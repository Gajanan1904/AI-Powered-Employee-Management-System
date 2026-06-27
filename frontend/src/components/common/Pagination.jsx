import React from 'react';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing <span className="text-bold">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
        <span className="text-bold">{Math.min(totalItems, currentPage * itemsPerPage)}</span> of{' '}
        <span className="text-bold">{totalItems}</span> results
      </div>
      <div className="pagination-controls">
        <button
          className="pag-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        {getPageItems().map((item, index) => {
          if (item === '...') {
            return (
              <span key={`ellipsis-${index}`} className="pag-ellipsis">
                ...
              </span>
            );
          }
          return (
            <button
              key={item}
              className={`pag-btn ${currentPage === item ? 'pag-active' : ''}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          );
        })}
        <button
          className="pag-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
