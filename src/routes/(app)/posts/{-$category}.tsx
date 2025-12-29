import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import PostCard from '~/components/shared/post-card'
import { getPosts } from '~/utils/fetch'

const postSearchSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})

export const Route = createFileRoute('/(app)/posts/{-$category}')({
  component: RouteComponent,
  validateSearch: (search) => postSearchSchema.parse(search),
  loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
  loader({ params, deps: { page, limit } }) {
    return getPosts(params.category, page, limit)
  },
})

function RouteComponent() {
  const posts = Route.useLoaderData()

  return (
    <div className='min-h-screen bg-linear-to-br from-cyan-50 via-white to-blue-50'>
      <div className='max-w-6xl mx-auto px-4 py-12'>
        {posts.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-xl text-gray-600'>Không tìm thấy bài viết nào phù hợp</p>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 gap-8'>
            {posts.map((post) => (
              <PostCard post={post} key={post.title} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
