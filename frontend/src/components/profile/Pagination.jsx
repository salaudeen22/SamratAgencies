const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: '#BDD7EB' }}>
      {/* Page info */}
      <div className="text-sm" style={{ color: '#94A1AB' }}>
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} orders
      </div>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-md border transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: '#BDD7EB',
            color: currentPage === 1 ? '#94A1AB' : '#1F2D38'
          }}
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Show first page, last page, current page, and pages around current
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-all ${
                    currentPage === pageNumber
                      ? 'text-white shadow-md'
                      : 'border hover:bg-gray-50'
                  }`}
                  style={
                    currentPage === pageNumber
                      ? { backgroundColor: '#895F42' }
                      : { borderColor: '#BDD7EB', color: '#1F2D38' }
                  }
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return (
                <span key={pageNumber} className="w-8 h-8 flex items-center justify-center text-sm" style={{ color: '#94A1AB' }}>
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-md border transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: '#BDD7EB',
            color: currentPage === totalPages ? '#94A1AB' : '#1F2D38'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
