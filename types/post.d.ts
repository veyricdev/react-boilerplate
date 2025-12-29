declare namespace API {
  type Post = {
    author:string
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: string
    content: string
    source: API.Category
  }
}
