import type { FileSystemItem } from './types'

export const mockFileSystem: FileSystemItem[] = [
  { id: 'root', name: 'Root', type: 'folder', updatedAt: new Date(), parentId: null },
  { id: '1', name: 'Documents', type: 'folder', updatedAt: new Date('2024-01-10'), parentId: 'root' },
  { id: '2', name: 'Images', type: 'folder', updatedAt: new Date('2024-01-11'), parentId: 'root' },
  { id: '3', name: 'Work', type: 'folder', updatedAt: new Date('2024-01-12'), parentId: '1' },
  { id: '4', name: 'Personal', type: 'folder', updatedAt: new Date('2024-01-12'), parentId: '1' },
  { id: '5', name: 'Resume.pdf', type: 'document', size: 1024 * 500, updatedAt: new Date('2024-02-01'), parentId: '3' },
  { id: '6', name: 'Budget.xlsx', type: 'document', size: 1024 * 20, updatedAt: new Date('2024-02-02'), parentId: '4' },
  { id: '7', name: 'Logo.png', type: 'image', size: 1024 * 2000, updatedAt: new Date('2024-01-15'), parentId: '2' },
  {
    id: '8',
    name: 'Design.fig',
    type: 'unknown',
    size: 1024 * 50000,
    updatedAt: new Date('2024-01-20'),
    parentId: '2',
  },
  { id: '9', name: 'Notes.txt', type: 'document', size: 1024, updatedAt: new Date(), parentId: 'root' },
]
