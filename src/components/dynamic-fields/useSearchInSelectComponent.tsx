import { useCallback } from 'react'

export default function useSearchInSelectOptions() {
  const searchInSelectOptions = useCallback((input: string, option: any) => (
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    || (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
  ), [])

  return searchInSelectOptions
}
