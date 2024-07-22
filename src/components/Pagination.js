const Pagination = ({data, itemsPerPage, onPageChange, curentPage}) => {
  const pageCount = Math.ceil(data.length/itemsPerPage);

  const pageNumbers = [];
  for(let i = 1; i <= pageCount; i++){
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  }

  return (
    <div className="d-flex justify-content-center">
      {pageNumbers.map(number => (
        <button key={number} onClick={()=> handlePageClick(number)} className="btn btn-sm btn-outline-primary mx-1" disabled={number === curentPage}>
          {number}
        </button>
      ))}
    </div>
  )
}

export default Pagination;