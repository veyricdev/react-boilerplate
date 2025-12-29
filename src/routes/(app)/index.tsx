import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import PostCard from '~/components/shared/post-card'
import { Button } from '~/components/ui/button'
import { getCategories, getPosts } from '~/utils/fetch'

export const Route = createFileRoute('/(app)/')({
  component: App,
  loader() {
    return Promise.all([getCategories(), getPosts()])
  },
})

function App() {
  const [categories, posts] = Route.useLoaderData()

  return (
    <div className='min-h-screen bg-linear-to-br from-cyan-50 via-white to-blue-50'>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-linear-to-r from-cyan-600 to-blue-600 text-white'>
        <div className='absolute inset-0 bg-black opacity-10'></div>
        <div className='relative max-w-6xl mx-auto px-4 py-24 sm:py-32'>
          <div className='text-center space-y-6'>
            <h1 className='text-5xl sm:text-6xl font-bold tracking-tight'>Chào mừng đến Blog của chúng tôi</h1>
            <p className='text-xl sm:text-2xl text-cyan-100 max-w-3xl mx-auto'>
              Khám phá những kiến thức, kinh nghiệm và xu hướng mới nhất về công nghệ, lập trình và thiết kế
            </p>
            <Button className='inline-flex items-center gap-2 bg-white text-cyan-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-cyan-50 transition-all transform hover:scale-105 shadow-lg'>
              Khám phá ngay
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className='max-w-6xl mx-auto px-4 py-16'>
        <h2 className='text-3xl font-bold text-gray-800 mb-8'>Bài viết nổi bật</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {posts.map((post) => (
            <PostCard post={post} key={post.title} />
          ))}
        </div>
        <div className='text-center mt-12'>
          <Link
            to='/posts'
            className='inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-cyan-700 transition-colors'
          >
            Xem tất cả bài viết
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className='bg-linear-to-r from-cyan-600 to-blue-600 text-white py-16'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-8 text-center'>Danh mục nổi bật</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {categories.map((category) => (
              <Link
                to='/posts/{-$category}'
                params={{ category: category.id }}
                key={category.id}
                className='bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all cursor-pointer transform hover:scale-105'
              >
                <h3 className='font-semibold text-lg' title={category.description}>
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
