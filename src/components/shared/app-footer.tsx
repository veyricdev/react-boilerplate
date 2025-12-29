import { BookOpen } from 'lucide-react'

export default function AppFooter() {
  return (
    <footer className='bg-gray-900 text-white py-12'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid md:grid-cols-3 gap-8'>
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-10 h-10 bg-linear-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center'>
                <BookOpen className='text-white' size={24} />
              </div>
              <span className='text-xl font-bold'>TechBlog</span>
            </div>
            <p className='text-gray-400'>Chia sẻ kiến thức và kinh nghiệm về công nghệ, lập trình và thiết kế.</p>
          </div>
          <div>
            <h3 className='font-bold mb-4'>Liên hệ</h3>
            <p className='text-gray-400'>
              Email: contact@techblog.com
              <br />
              Địa chỉ: Hà Nội, Việt Nam
            </p>
          </div>
        </div>
        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
          <p>&copy; 2025 TechBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
