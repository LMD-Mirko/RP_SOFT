import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Pagination.module.css'

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.total_pages <= 1) {
    return null
  }

  const { page, total_pages, has_next, has_previous } = pagination

  const handlePrevious = () => {
    if (has_previous && onPageChange) {
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (has_next && onPageChange) {
      onPageChange(page + 1)
    }
  }

  const handlePageClick = (pageNumber) => {
    if (onPageChange && pageNumber !== page) {
      onPageChange(pageNumber)
    }
  }

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    let end = Math.min(total_pages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span className={styles.text}>
          Página {page} de {total_pages}
        </span>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handlePrevious}
          disabled={!has_previous}
          title="Página anterior"
        >
          <ChevronLeft size={18} />
          Anterior
        </button>

        <div className={styles.pageNumbers}>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`${styles.pageButton} ${pageNumber === page ? styles.active : ''}`}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          className={styles.button}
          onClick={handleNext}
          disabled={!has_next}
          title="Página siguiente"
        >
          Siguiente
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

