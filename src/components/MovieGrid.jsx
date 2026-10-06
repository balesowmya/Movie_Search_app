import MovieCard from './MovieCard.jsx'

export default function MovieGrid({ movies, onMovieClick }) {
  return <div className="movie-grid">{movies.map((movie, index) => <MovieCard key={movie.id} movie={movie} index={index} onClick={onMovieClick} />)}</div>
}
