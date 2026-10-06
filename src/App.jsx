import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import FilterBar from './components/FilterBar.jsx'
import MovieGrid from './components/MovieGrid.jsx'
import Pagination from './components/Pagination.jsx'
import Loading from './components/Loading.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'
import MovieDetails from './components/MovieDetails.jsx'
import { getMovieDetails, searchMovies } from './services/tmdbApi.js'

export default function App() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [sort, setSort] = useState('default')
  const [rating, setRating] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [requestId, setRequestId] = useState(0)
  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [movieDetails, setMovieDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const [detailsRequestId, setDetailsRequestId] = useState(0)

  useEffect(() => {
    if (!query) return undefined
    const controller = new AbortController()
    setLoading(true)
    setError('')
    searchMovies(query, page, controller.signal)
      .then((data) => {
        console.log('TMDB response:', data)
        console.log('Movies:', data.results)
        setMovies(Array.isArray(data.results) ? data.results : [])
        setPage(data.page || page)
        setTotalPages(Math.min(data.total_pages || 0, 500))
        setTotalResults(data.total_results || 0)
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setMovies([])
          setTotalResults(0)
          setError(requestError.message)
          console.error('Movie search error:', requestError)
        }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [query, page, requestId])

  useEffect(() => {
    if (selectedMovieId === null) return undefined
    const controller = new AbortController()
    setDetailsLoading(true)
    setDetailsError('')
    getMovieDetails(selectedMovieId, controller.signal)
      .then(setMovieDetails)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setMovieDetails(null)
          setDetailsError(requestError.message)
        }
      })
      .finally(() => { if (!controller.signal.aborted) setDetailsLoading(false) })
    return () => controller.abort()
  }, [selectedMovieId, detailsRequestId])

  function openMovie(movie) {
    setMovieDetails(null)
    setDetailsError('')
    setDetailsLoading(true)
    setSelectedMovieId(movie.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function backToResults() {
    setSelectedMovieId(null)
    setMovieDetails(null)
    setDetailsError('')
    setDetailsLoading(false)
  }

  function submitSearch(event) {
    event.preventDefault()
    const cleanQuery = input.trim()
    if (!cleanQuery) {
      setSearched(true)
      setMovies([])
      setQuery('')
      setError('empty_search')
      return
    }
    setError('')
    setSearched(true)
    setPage(1)
    setQuery(cleanQuery)
    setRequestId((current) => current + 1)
  }

  function changePage(nextPage) {
    if (nextPage < 1 || nextPage > totalPages || loading) return
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const visibleMovies = useMemo(() => {
    let results = movies.filter((movie) => rating === 'all' || (Number(movie.vote_average) || 0) >= Number(rating))
    results = [...results]
    if (sort === 'newest') results.sort((a, b) => {
      if (!a.release_date) return 1
      if (!b.release_date) return -1
      return b.release_date.localeCompare(a.release_date)
    })
    if (sort === 'oldest') results.sort((a, b) => {
      if (!a.release_date) return 1
      if (!b.release_date) return -1
      return a.release_date.localeCompare(b.release_date)
    })
    if (sort === 'rating-high') results.sort((a, b) => (Number(b.vote_average) || 0) - (Number(a.vote_average) || 0))
    if (sort === 'rating-low') results.sort((a, b) => (Number(a.vote_average) || 0) - (Number(b.vote_average) || 0))
    return results
  }, [movies, rating, sort])

  const displayedError = error === 'empty_search' ? '' : error

  return (
    <div className="app-shell" id="top">
      <Header />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-content"><p className="eyebrow"><span /> THE MOVIE DISCOVERY DESK</p>
            <h1 id="hero-title">Find your next<br /><em>favorite story.</em></h1>
            <p className="hero-copy">From timeless classics to the latest releases.<br className="desktop-break" /> Your next movie night starts here.</p>
            <SearchBar value={input} onChange={setInput} onSubmit={submitSearch} disabled={loading} />
            {error === 'empty_search' && <p className="inline-error" role="alert">Please enter a movie name.</p>}
            <p className="search-hint">POWERED BY THE MOVIE DATABASE <span>·</span> SEARCH 100,000+ FILMS</p>
          </div>
          <div className="hero-orbit" aria-hidden="true"><div className="orbit-ring" /><div className="orbit-disc">▶</div><span className="orbit-star">✳</span><span className="orbit-dot" /></div>
        </section>

        {selectedMovieId !== null && <MovieDetails movie={movieDetails} loading={detailsLoading} error={detailsError} onBack={backToResults} onRetry={() => setDetailsRequestId((current) => current + 1)} />}

        {selectedMovieId === null && query && <section className="results-section" aria-live="polite">
          <div className="section-heading"><div><p className="eyebrow">YOUR SEARCH</p><h2>Results for <span>“{query}”</span></h2></div>{!loading && !error && <span className="page-label">PAGE {page} <i>/</i> {totalPages || 1}</span>}</div>
          <FilterBar sort={sort} setSort={setSort} rating={rating} setRating={setRating} totalResults={totalResults} />
          <p className="filter-note">Rating and sorting apply to movies on this page. Page navigation uses TMDB search results.</p>
          {!loading && !displayedError && movies.length > 0 && <p className="search-result-status" role="status">Found {totalResults} {totalResults === 1 ? 'movie' : 'movies'}</p>}
          {loading ? <Loading /> : displayedError ? <ErrorMessage error={displayedError} onRetry={() => setRequestId((current) => current + 1)} /> : visibleMovies.length ? <MovieGrid movies={visibleMovies} onMovieClick={openMovie} /> : <div className="status-panel empty-panel"><span className="status-symbol">⌕</span><h2>{movies.length ? 'No titles match this rating' : 'No movies found'}</h2><p>{movies.length ? 'Try a lower rating filter to see more results.' : `No movies found for “${query}”. Try another title.`}</p></div>}
          {!loading && !displayedError && movies.length > 0 && <Pagination page={page} totalPages={totalPages} onPageChange={changePage} disabled={loading} />}
        </section>}
        {!query && !searched && <section className="welcome-strip"><span className="welcome-icon">✳</span><div><h2>A good film is always a good idea.</h2><p>Search above to explore the world of movies.</p></div><span className="welcome-arrow">↗</span></section>}
      </main>
      <footer><span>© {new Date().getFullYear()} REELFIND</span><span>FILM IS BETTER SHARED <b>✳</b></span></footer>
    </div>
  )
}
