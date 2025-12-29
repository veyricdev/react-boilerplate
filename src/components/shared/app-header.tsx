import { Link, useLocation } from '@tanstack/react-router'
import { BookOpen, Home, List, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  useEffect(() => {
    if (currentPath) setMenuOpen(false)
  }, [currentPath])

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-linear-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center'>
              <BookOpen className='text-white' size={24} />
            </div>
            <span className='text-xl font-bold text-gray-800'>TechBlog</span>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center gap-6'>
            <Link
              to='/'
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentPath === '/' ? 'bg-cyan-600 text-white' : 'text-gray-700 hover:bg-cyan-50'
              }`}
            >
              <Home size={18} />
              <span>Trang chủ</span>
            </Link>
            <Link
              to='/posts'
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentPath.startsWith('/posts') ? 'bg-cyan-600 text-white' : 'text-gray-700 hover:bg-cyan-50'
              }`}
            >
              <List size={18} />
              <span>Danh sách</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className='md:hidden text-gray-700 p-2' type='button'>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className='md:hidden py-4 border-t'>
            <Link
              to='/'
              className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg transition-colors ${
                currentPath === 'home' ? 'bg-cyan-600 text-white' : 'text-gray-700 hover:bg-cyan-50'
              }`}
            >
              <Home size={18} />
              <span>Trang chủ</span>
            </Link>
            <Link
              to='/posts'
              className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg transition-colors mt-2 ${
                currentPath.startsWith('/posts') ? 'bg-cyan-600 text-white' : 'text-gray-700 hover:bg-cyan-50'
              }`}
            >
              <List size={18} />
              <span>Danh sách</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
