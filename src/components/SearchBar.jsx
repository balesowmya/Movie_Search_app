export default function SearchBar({ value, onChange, onSubmit, disabled }) {
  return (
    <form className="search-form" onSubmit={onSubmit} role="search">
      <label className="sr-only" htmlFor="movie-query">Movie title</label>
      <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></svg>
      <input id="movie-query" type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search a movie, any movie…" autoComplete="off" />
      <button className="search-button" type="submit" disabled={disabled}><span>Search</span><span aria-hidden="true">↗</span></button>
    </form>
  )
}
