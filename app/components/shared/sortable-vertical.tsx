'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DraggableAttributes,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '~/lib/utils'

import type { ComponentProps, CSSProperties, ReactNode } from 'react'

type SortableVerticalProps<T extends Record<string, any>> = Readonly<{
  items: T[]
  onDragEnd?(event: DragEndEvent): void
  sortableItem: (data: T, attrs: DraggableAttributes) => ReactNode
  itemKey?: keyof T
}>

export default function SortableVertical<T extends Record<string, any>>({
  items,
  onDragEnd,
  sortableItem,
  itemKey = 'id',
}: SortableVerticalProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={items.map((item) => item[itemKey]).filter(Boolean)}
        strategy={verticalListSortingStrategy}
      >
        {items
          .filter((item) => item && item[itemKey])
          .map((item) => (
            <SortableItem key={item[itemKey]} id={item[itemKey]}>
              {(attributes) => sortableItem(item, { ...attributes })}
            </SortableItem>
          ))}
      </SortableContext>
    </DndContext>
  )
}

type SortableItemProps = Readonly<
  Omit<ComponentProps<'div'>, 'children'> & {
    id: UniqueIdentifier
    children: (attrs: DraggableAttributes) => ReactNode
    asChild?: boolean
  }
>

function SortableItem({ id, children, className, asChild, ...props }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    position: 'relative',
  }

  const attrsListeners = { ...attributes, ...listeners }

  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-slot='sortable-item'
      ref={setNodeRef}
      style={style}
      className={cn('transition-colors', isDragging && 'bg-accent rounded-md opacity-70 shadow-md', className)}
      {...props}
    >
      {children(attrsListeners)}
    </Comp>
  )
}
