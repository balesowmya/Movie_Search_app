import { useState } from 'react'

function Poster({ movie }) {
  const [failed, setFailed] = useState(false)
  if (!movie.poster_path || failed) return <div className="poster-fallback" role="img" aria-label={`No poster available for ${movie.title}`}><span className="fallback-icon">▧</span><span>NO POSTER<br />AVAILABLE</span></div>
  return <img className="poster-image" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} poster`} loading="lazy" onError={() => setFailed(true)} />
}

export default function MovieCard({ movie, index, onClick }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'Release date unknown'
  const rating = Number.isFinite(movie.vote_average) ? movie.vote_average.toFixed(1) : '—'
  return (
    <article className="movie-card" style={{ '--card-index': index }}>
      <button className="movie-card-button" type="button" onClick={() => onClick(movie)} aria-label={`View details for ${movie.title}`}>
        <div className="poster-wrap"><Poster movie={movie} /><span className="rating-badge"><span>★</span> {rating}</span></div>
        <div className="movie-info"><div className="movie-meta">{year}</div><h2>{movie.title || 'Untitled movie'}</h2><p>{movie.overview?.trim() || 'No overview is available for this movie yet.'}</p></div>
      </button>
    </article>
  )
}
