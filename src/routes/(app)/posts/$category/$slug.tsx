import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Calendar, User } from 'lucide-react'
import { getPost } from '~/utils/fetch'

export const Route = createFileRoute('/(app)/posts/$category/$slug')({
  component: RouteComponent,
  loader({ params }) {
    return getPost(params.slug)
  },
})

function RouteComponent() {
  const post = Route.useLoaderData()
  const { category } = Route.useParams()

  return (
    <div className='min-h-screen bg-linear-to-br from-cyan-50 via-white to-blue-50'>
      <div className='relative h-96 bg-linear-to-r from-cyan-600 to-blue-600 overflow-hidden'>
        <img src={post.urlToImage} alt={post.title} className='w-full h-full object-cover opacity-40' />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 pb-12'>
          <div className='inline-block bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4'>
            {post.source.name}
          </div>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-4'>{post.title}</h1>
          <div className='flex items-center gap-6 text-white/90'>
            <div className='flex items-center gap-2'>
              <User size={18} />
              <span>{post.author}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar size={18} />
              <span>{new Intl.DateTimeFormat('en-US').format(new Date(post.publishedAt))}</span>
            </div>
            <span>1 minute</span>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className='bg-white rounded-2xl shadow-lg p-8 sm:p-12'>
          <p className='text-xl text-gray-700 leading-relaxed mb-6 font-medium'>{post.description}</p>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-700 leading-relaxed whitespace-pre-line'>{post.content}</p>
          </div>

          <div className='mt-12 pt-8 border-t border-gray-200'>
            <Link
              to='/posts/{-$category}'
              params={{ category }}
              className='inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors'
            >
              <ArrowRight size={20} className='rotate-180' />
              Quay lại danh sách
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {/* <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bài viết liên quan</h2>
            <div className="grid md:grid-cols-2 gap-6">
              
            </div>
          </div> */}
      </div>
    </div>
  )
}
