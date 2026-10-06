export default function FilterBar({ sort, setSort, rating, setRating, totalResults }) {
  return (
    <div className="toolbar">
      <div className="results-count">{totalResults > 0 ? <><strong>{totalResults.toLocaleString()}</strong> titles found</> : 'Explore results'}</div>
      <div className="filter-controls">
        <label>Rating
          <select value={rating} onChange={(event) => setRating(event.target.value)}>
            <option value="all">All ratings</option><option value="7">7+ ★</option><option value="6">6+ ★</option><option value="5">5+ ★</option><option value="4">4+ ★</option>
          </select>
        </label>
        <label>Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="default">Relevance</option><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="rating-high">Highest rated</option><option value="rating-low">Lowest rated</option>
          </select>
        </label>
      </div>
    </div>
  )
}
