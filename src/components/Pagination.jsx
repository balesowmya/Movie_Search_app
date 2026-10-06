export default function Pagination({ page, totalPages, onPageChange, disabled }) {
  if (totalPages <= 1) return null
  const maxButtons = 5
  const start = Math.max(1, Math.min(page - 2, totalPages - maxButtons + 1))
  const end = Math.min(totalPages, start + maxButtons - 1)
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index)
  return (
    <nav className="pagination" aria-label="Search result pages">
      <button className="page-arrow" type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1 || disabled}>← <span>Previous</span></button>
      <div className="page-numbers">{start > 1 && <><button type="button" onClick={() => onPageChange(1)} disabled={disabled}>1</button>{start > 2 && <span className="ellipsis">…</span>}</>}{pages.map((number) => <button type="button" key={number} className={number === page ? 'active' : ''} aria-current={number === page ? 'page' : undefined} onClick={() => onPageChange(number)} disabled={disabled}>{number}</button>)}{end < totalPages && <>{end < totalPages - 1 && <span className="ellipsis">…</span>}<button type="button" onClick={() => onPageChange(totalPages)} disabled={disabled}>{totalPages}</button></>}</div>
      <button className="page-arrow" type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages || disabled}><span>Next</span> →</button>
    </nav>
  )
}
