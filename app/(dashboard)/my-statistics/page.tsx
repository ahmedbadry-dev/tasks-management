import { MyStatisticsView } from '@/features/my-statistics/components/MyStatisticsView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Statistics',
}

export default function MyStatisticsPage() {
  return <MyStatisticsView />
}
