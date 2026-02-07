import React from 'react';
// @ts-ignore
import ReactPaginateImport from 'react-paginate';
import css from './Pagination.module.css';

// Хак для виправлення помилки "Element type is invalid" у Vite
// Якщо бібліотека завантажилась як об'єкт, ми беремо з неї .default
const ReactPaginate = (ReactPaginateImport as any).default 
  ? (ReactPaginateImport as any).default 
  : ReactPaginateImport;

interface PaginationProps {
  totalPages: number;
  forcePage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  forcePage,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageCount={totalPages}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      onPageChange={onPageChange}
      forcePage={forcePage}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      disabledClassName={css.disabled}
    />
  );
};

export default Pagination;