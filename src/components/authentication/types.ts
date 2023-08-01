import { ReactNode } from 'react'

export type ValidationStatusType = {
  error: boolean
  message?: string
  isLoading: boolean
  component?: ReactNode
}
