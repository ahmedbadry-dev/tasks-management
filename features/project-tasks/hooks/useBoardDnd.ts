'use client'

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import {
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { toast } from 'sonner'

import { updateTaskStatusAction } from '../actions/updateTaskStatusAction'
import { TTask } from '../types'

type ColumnTasksMap = Record<string, TTask[]>

type UseBoardDndOptions = {
  columnTasksMap: ColumnTasksMap
  setColumnTasksMap: Dispatch<SetStateAction<ColumnTasksMap>>
  statusIds: string[]
}

type UseBoardDndResult = {
  activeTask: TTask | null
  sensors: ReturnType<typeof useSensors>
  handleDragStart: (event: DragStartEvent) => void
  handleDragEnd: (event: DragEndEvent) => Promise<void>
  handleDragCancel: () => void
}

function cloneMap(map: ColumnTasksMap): ColumnTasksMap {
  return Object.fromEntries(
    Object.entries(map).map(([columnId, tasks]) => [columnId, [...tasks]])
  )
}

function findTaskColumnId(map: ColumnTasksMap, taskId: string): string | null {
  for (const [columnId, tasks] of Object.entries(map)) {
    if (tasks.some((task) => task.id === taskId)) return columnId
  }
  return null
}

function findTaskById(map: ColumnTasksMap, taskId: string): TTask | null {
  for (const tasks of Object.values(map)) {
    const task = tasks.find((item) => item.id === taskId)
    if (task) return task
  }
  return null
}

function moveTaskBetweenColumns(
  map: ColumnTasksMap,
  taskId: string,
  sourceColumnId: string,
  targetColumnId: string
): ColumnTasksMap {
  if (sourceColumnId === targetColumnId) return map

  const sourceTasks = map[sourceColumnId] ?? []
  const taskToMove = sourceTasks.find((task) => task.id === taskId)
  if (!taskToMove) return map

  const sourceWithoutTask = sourceTasks.filter((task) => task.id !== taskId)
  const targetTasks = (map[targetColumnId] ?? []).filter(
    (task) => task.id !== taskId
  )
  const movedTask: TTask = { ...taskToMove, status: targetColumnId }

  return {
    ...map,
    [sourceColumnId]: sourceWithoutTask,
    [targetColumnId]: [movedTask, ...targetTasks],
  }
}

export function useBoardDnd({
  columnTasksMap,
  setColumnTasksMap,
  statusIds,
}: UseBoardDndOptions): UseBoardDndResult {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const [activeTask, setActiveTask] = useState<TTask | null>(null)
  const columnTasksMapRef = useRef(columnTasksMap)
  const dragSnapshotRef = useRef<ColumnTasksMap | null>(null)

  useEffect(() => {
    columnTasksMapRef.current = columnTasksMap
  }, [columnTasksMap])

  const isKnownColumnId = useCallback(
    (id: string) => statusIds.includes(id),
    [statusIds]
  )

  const resolveTargetColumnId = useCallback(
    (map: ColumnTasksMap, overId: string): string | null => {
      if (isKnownColumnId(overId)) return overId
      return findTaskColumnId(map, overId)
    },
    [isKnownColumnId]
  )

  const clearDragState = useCallback(() => {
    setActiveTask(null)
    dragSnapshotRef.current = null
  }, [])

  const restoreSnapshot = useCallback(() => {
    const snapshot = dragSnapshotRef.current
    if (!snapshot) return
    columnTasksMapRef.current = snapshot
    setColumnTasksMap(snapshot)
  }, [setColumnTasksMap])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const taskId = String(event.active.id)
    const map = columnTasksMapRef.current
    const task = findTaskById(map, taskId)
    if (!task) return

    setActiveTask(task)
    dragSnapshotRef.current = cloneMap(map)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const snapshot = dragSnapshotRef.current
      const task = activeTask

      if (!snapshot || !task) {
        clearDragState()
        return
      }

      if (!event.over) {
        restoreSnapshot()
        clearDragState()
        return
      }

      const latestMap = columnTasksMapRef.current
      const sourceColumnId = findTaskColumnId(latestMap, task.id)
      const targetColumnId = resolveTargetColumnId(latestMap, String(event.over.id))

      if (!sourceColumnId || !targetColumnId) {
        restoreSnapshot()
        clearDragState()
        return
      }

      if (sourceColumnId === targetColumnId) {
        clearDragState()
        return
      }

      const optimisticMap = moveTaskBetweenColumns(
        latestMap,
        task.id,
        sourceColumnId,
        targetColumnId
      )

      columnTasksMapRef.current = optimisticMap
      setColumnTasksMap(optimisticMap)

      const result = await updateTaskStatusAction(task.id, targetColumnId)

      if (!result.success) {
        restoreSnapshot()
        toast.error(result.error || 'Failed to update task status')
      }

      clearDragState()
    },
    [
      activeTask,
      clearDragState,
      resolveTargetColumnId,
      restoreSnapshot,
      setColumnTasksMap,
    ]
  )

  const handleDragCancel = useCallback(() => {
    restoreSnapshot()
    clearDragState()
  }, [clearDragState, restoreSnapshot])

  return {
    activeTask,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}

