export const getCategories = async (): Promise<API.Category[]> => {
  const res = await fetch(
    'https://newsapi.org/v2/top-headlines/sources?language=en&category=technology&apiKey=a789ca5c06d64e3290322052fd3aae17'
  )

  const data = await res.json()

  return data.sources ?? []
}

export const getPosts = async (source?: string, page = 1, limit = 10): Promise<API.Post[]> => {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?apiKey=a789ca5c06d64e3290322052fd3aae17&language=en&sortBy=publishedAt&pageSize=${limit}&page=${page}${source ? `&sources=${source}` : ''}`
  )

  const data = await res.json()

  return data.articles ?? []
}

export const getPost = async (q: string): Promise<API.Post> => {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?apiKey=a789ca5c06d64e3290322052fd3aae17&language=en&sortBy=publishedAt${q ? `&q=${q}` : ''}`
  )

  const data = await res.json()

  return (data.articles ?? [])?.[0]
}
