import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export interface AvailableDayOptions {
  value: string,
  label: string,
}

export default function useAvailableDaysFromEvent(event: any) {
  const [allDays, setAllDays] = useState<AvailableDayOptions[]>([])
  // If dates exist, then iterate the specific dates array, formating specially.
  useEffect(() => {
    if (event.dates?.length > 0) {
      const newDays = event.dates.map((dates: any) => {
        const formatDate = dayjs(dates, ['YYYY-MM-DD']).format('YYYY-MM-DD')
        return {
          value: formatDate,
          label: formatDate,
        }
      })
      setAllDays(newDays)
    } else {
      // If else, take the start date and the end date and format it
      const initMoment = dayjs(event.date_start)
      const endMoment = dayjs(event.date_end)
      const dayDiff = endMoment.diff(initMoment, 'days')
      // Convert all days between this range
      const newDays: any[] = []
      for (let i = 0; i < dayDiff + 1; i++) {
        const formatDate = dayjs(initMoment)
          .add(i, 'd')
          .format('YYYY-MM-DD')
        newDays.push({ value: formatDate, label: formatDate })
      }
      setAllDays(newDays)
    }
  }, [event])

  return allDays
}