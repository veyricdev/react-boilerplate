import { Link } from '@tanstack/react-router'
import { Calendar, User } from 'lucide-react'

export default function PostCard({ post }: Readonly<{ post: API.Post }>) {
  return (
    <div
      key={post.title}
      className='bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer'
    >
      <Link
        to='/posts/$category/$slug'
        params={{ category: post.source.id, slug: post.title }}
        className='relative h-48 bg-linear-to-br from-cyan-400 to-blue-500 overflow-hidden'
      >
        <img src={post.urlToImage} alt={post.title} className='w-full h-full object-cover' />
        <div className='absolute top-4 right-4 bg-white text-cyan-600 px-3 py-1 rounded-full text-sm font-semibold'>
          {post.source.name}
        </div>
      </Link>
      <div className='p-4'>
        <Link to='/posts/$category/$slug' params={{ category: post.source.id, slug: post.title }}>
          <h3 className='text-xl line-clamp-1 font-bold text-gray-800 mb-2 hover:text-cyan-600 transition-colors'>
            {post.title}
          </h3>
        </Link>
        <p className='text-gray-600 mb-4 line-clamp-2'>{post.description}</p>
        <div className='flex items-center justify-between text-sm text-gray-500'>
          <div className='flex items-center gap-2'>
            {post.author && (
              <>
                <User size={16} />
                <span className='line-clamp-1'>{post.author}</span>
              </>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {post.publishedAt && (
              <>
                <Calendar size={16} />
                <span className='line-clamp-1'>
                  {new Intl.DateTimeFormat('en-US').format(new Date(post.publishedAt))}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
