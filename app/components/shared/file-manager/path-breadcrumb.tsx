import { HomeIcon } from 'lucide-react'
import { Fragment } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { cn } from '~/lib/utils'

import { useFileManager } from '.'

export default function PathBreadcrumb() {
  const { currentPath, currentPathArr, changeSearchParams } = useFileManager()

  const onPathClick = (index: number) => {
    changeSearchParams('path', currentPathArr.slice(0, index + 1).join('/'))
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage
            className={cn(currentPath === '/' || 'hover:text-foreground transition-colors text-inherit cursor-pointer')}
            onClick={() => currentPath === '/' || changeSearchParams('path', '')}
          >
            <HomeIcon size={14} aria-hidden='true' />
            <span className='sr-only'>Home</span>
          </BreadcrumbPage>
        </BreadcrumbItem>
        {!!currentPathArr?.length || <BreadcrumbSeparator />}
        {currentPathArr?.map((path, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === currentPathArr.length - 1 ? (
                <BreadcrumbPage>{path}</BreadcrumbPage>
              ) : (
                <BreadcrumbPage
                  onClick={() => onPathClick(index)}
                  className='hover:text-foreground transition-colors text-inherit cursor-pointer'
                >
                  {path}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
