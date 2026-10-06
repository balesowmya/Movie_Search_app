function formatDate(date) {
  if (!date) return 'Release date unavailable'
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).format(parsed)
}

function formatRuntime(runtime) {
  if (!runtime) return null
  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`
}

export default function MovieDetails({ movie, loading, error, onBack, onRetry }) {
  if (loading) return <section className="movie-details-state"><button className="back-button" onClick={onBack}>← Back to Results</button><div className="status-panel" role="status"><span className="spinner" /><p>Loading movie details…</p></div></section>
  if (error) return <section className="movie-details-state"><button className="back-button" onClick={onBack}>← Back to Results</button><div className="status-panel error-panel" role="alert"><span className="status-symbol">!</span><h2>Couldn’t load movie details</h2><p>{error}</p><button className="text-button" onClick={onRetry}>Try again ↗</button></div></section>
  if (!movie) return null

  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
  const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null
  const languageNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(undefined, { type: 'language' }) : null
  const language = movie.original_language ? languageNames?.of(movie.original_language) || movie.original_language.toUpperCase() : 'Unknown'

  return (
    <section className="movie-details" aria-labelledby="details-title">
      <div className="details-backdrop" style={backdrop ? { backgroundImage: `linear-gradient(90deg, #101014 5%, #101014d9 48%, #10101477), linear-gradient(0deg, #101014 0%, transparent 75%), url("${backdrop}")` } : undefined} />
      <button className="back-button" onClick={onBack}>← Back to Results</button>
      <div className="details-content">
        <div className="details-poster-wrap">{poster ? <img className="details-poster" src={poster} alt={`${movie.title} poster`} /> : <div className="poster-fallback details-poster-fallback"><span className="fallback-icon">▧</span><span>NO POSTER<br />AVAILABLE</span></div>}</div>
        <div className="details-copy">
          <p className="eyebrow"><span /> MOVIE DETAILS</p>
          <h1 id="details-title">{movie.title}</h1>
          {movie.tagline && <p className="details-tagline">“{movie.tagline}”</p>}
          <div className="details-facts"><span className="details-rating">★ {Number.isFinite(movie.vote_average) ? movie.vote_average.toFixed(1) : '—'}</span><span>Release: {formatDate(movie.release_date)}</span>{formatRuntime(movie.runtime) && <span>{formatRuntime(movie.runtime)}</span>}</div>
          <h2>Overview</h2><p className="details-overview">{movie.overview || 'No overview is available for this movie yet.'}</p>
          <dl className="details-metadata"><div><dt>Original language</dt><dd>{language}</dd></div><div><dt>Popularity</dt><dd>{Number.isFinite(movie.popularity) ? movie.popularity.toFixed(1) : '—'}</dd></div><div className="genres-row"><dt>Genres</dt><dd>{movie.genres?.length ? movie.genres.map((genre) => genre.name).join(' · ') : 'Not available'}</dd></div></dl>
        </div>
      </div>
    </section>
  )
}
