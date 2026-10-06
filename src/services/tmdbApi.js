const API_URL = 'https://api.themoviedb.org/3/search/movie'
const PLACEHOLDER_KEYS = ['your_tmdb_api_key_here', 'your_api_key', 'YOUR_API_KEY']

export async function searchMovies(query, page = 1, signal) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim()
  const keyAvailable = Boolean(apiKey && !PLACEHOLDER_KEYS.includes(apiKey))

  // Never log the key. The redacted request URL is useful for browser debugging.
  console.info('[TMDB] API key available:', keyAvailable)
  console.info('[TMDB] Search query:', query)
  if (!keyAvailable) {
    throw new Error('TMDB API key is missing. Replace YOUR_API_KEY in the root .env file with your real key, then restart the Vite server.')
  }

  const params = new URLSearchParams({ api_key: apiKey, query: query.trim(), page: String(page) })
  const debugParams = new URLSearchParams({ api_key: '[redacted]', query: query.trim(), page: String(page) })
  console.info('[TMDB] Request URL:', `${API_URL}?${debugParams}`)

  let response
  try {
    response = await fetch(`${API_URL}?${params}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    console.error('[TMDB] Network error:', error)
    throw new Error('Could not connect to TMDB. Check your internet connection and try again.')
  }

  console.info('[TMDB] Response status:', response.status)
  let data
  try {
    data = await response.json()
  } catch (error) {
    console.error('[TMDB] Could not parse response JSON:', error)
    throw new Error(`TMDB returned an unreadable response (HTTP ${response.status}).`)
  }

  console.info('[TMDB] API response:', data)
  console.info('[TMDB] Movie results:', data.results?.length ?? 0)

  if (!response.ok) {
    const detail = data.status_message ? ` ${data.status_message}` : ''
    if (response.status === 401) throw new Error(`TMDB rejected the API key (HTTP 401). Replace it in .env.${detail}`)
    if (response.status === 404) throw new Error(`TMDB search endpoint was not found (HTTP 404). Check the API URL.${detail}`)
    if (response.status === 429) throw new Error(`TMDB rate limit reached (HTTP 429). Wait a moment and retry.${detail}`)
    throw new Error(`TMDB request failed (HTTP ${response.status}).${detail}`)
  }

  if (!Array.isArray(data.results)) throw new Error('TMDB responded without a movie results list. Please try again.')
  return data
}

export async function getMovieDetails(movieId, signal) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim()
  if (!apiKey || PLACEHOLDER_KEYS.includes(apiKey)) {
    throw new Error('TMDB API key is missing. Add a real VITE_TMDB_API_KEY to the root .env file.')
  }

  const params = new URLSearchParams({ api_key: apiKey })
  const url = `https://api.themoviedb.org/3/movie/${encodeURIComponent(movieId)}?${params}`
  let response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Could not connect to TMDB. Check your internet connection and try again.')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error(`TMDB returned an unreadable response (HTTP ${response.status}).`)
  }

  if (!response.ok) {
    const detail = data.status_message ? ` ${data.status_message}` : ''
    if (response.status === 401) throw new Error(`TMDB rejected the API key (HTTP 401).${detail}`)
    if (response.status === 404) throw new Error(`Movie details were not found (HTTP 404).${detail}`)
    if (response.status === 429) throw new Error(`TMDB rate limit reached (HTTP 429).${detail}`)
    throw new Error(`TMDB request failed (HTTP ${response.status}).${detail}`)
  }

  return data
}
