export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="status-panel error-panel" role="alert">
      <span className="status-symbol">!</span>
      <h2>Search interrupted</h2>
      <p><strong>TMDB API Error:</strong> {error}</p>
      <button className="text-button" onClick={onRetry}>Try again <span>↗</span></button>
    </div>
  )
}
