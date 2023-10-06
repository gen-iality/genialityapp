import { StateMessage } from '@context/MessageService'
import { OrganizationApi } from '@helpers/request'
import { useEffect, useState } from 'react'

export default function useCertificateFinder<T extends {} = any>(
  organizationId?: string,
) {
  const [items, setItems] = useState<T[]>([])
  const [pattern, setPattern] = useState('')
  const [organization, setOrganization] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [limitOfPreloading, setLimitOfPreloading] = useState(7)
  const [preloadedCerts, setPreloadedCerts] = useState<{ [key: string]: any[] }>({})

  /**
   * Update the internal pattern state.
   * @date 27/9/2023
   *
   * @param {string} newPattern
   */
  const updatePattern = (newPattern: string) => {
    setPattern(newPattern)
  }

  /**
   * Request to the API for the organization users that contain some pattern.
   * @date 27/9/2023
   *
   * @async
   * @template T
   * @param {string} orgId
   * @param {string} pattern
   * @returns {unknown}
   */
  const rawSearch = async <T extends {} = any>(orgId: string, pattern: string) => {
    try {
      const results = await OrganizationApi.searchCandidatesForCertificates(
        orgId,
        pattern,
      )
      console.debug(results)
      return results
        .sort((a, b) => {
          return (a?.valoration ?? 0) - (b?.valoration ?? 0)
        })
        .reverse()
        .map(({ organizationMember }) => organizationMember) as T[]
    } catch (err: any) {
      console.error(err)
      if (err.response?.data?.error) {
        StateMessage.show(null, 'error', err.response?.data?.error)
      }
      if (err.response?.status !== undefined) {
        const { status } = err.response
        switch (status) {
          case 403:
            StateMessage.show(null, 'error', 'Error en la solicitud')
            break
          case 400:
            StateMessage.show(null, 'error', 'Error de permiso')
            break
          case 500:
            StateMessage.show(null, 'error', 'Error del servidor')
            break
        }
      }
    }
    return [] as T[]
  }

  /**
   * Search organization users by a provided pattern or the internal pattern state and update other states.
   * @date 27/9/2023
   *
   * @async
   * @param {string|undefined} [newPattern]
   * @returns {*}
   */
  const search = async (newPattern?: string) => {
    if (newPattern) updatePattern(newPattern)
    const finalPattern = newPattern ?? pattern

    if (!organizationId) {
      console.warn('organizationId is invalid yet')
      return
    }

    console.debug(`searching for "${finalPattern}"...`)

    try {
      setIsSearching(true)
      const results = await rawSearch(organizationId, finalPattern)
      setItems(results)
    } catch (err: any) {
      console.error(err)
      if (err.response?.data?.error) {
        StateMessage.show(null, 'error', err.response?.data?.error)
      }
    }

    setIsSearching(false)
  }

  // NOTE: same api calling but with a nice name
  const loadCertsByUser = async (userId: string) => {
    if (!organizationId) {
      console.warn('organizationId is undefined yet')
      return []
    }
    const data = await OrganizationApi.searchCertificates(organizationId, userId)
    console.debug('data:', data)
    return data
  }

  const preloadCertsByUser = async (userId: string) => {
    const certs = await loadCertsByUser(userId)
    console.log('preload certs to user', userId, { certs })
    setPreloadedCerts((previous) => ({
      ...previous,
      [userId]: certs,
    }))
  }

  useEffect(() => {
    if (!organizationId) return

    setIsLoading(true)
    OrganizationApi.getOne(organizationId)
      .then((value) => {
        setOrganization(value)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [organizationId])

  useEffect(() => {
    for (let i = 0; i < limitOfPreloading && i < items.length; i++) {
      const element = items[i]
      const userId = (element as any).user._id

      preloadCertsByUser(userId)
    }
  }, [items, limitOfPreloading])

  return {
    items,
    search,
    pattern,
    updatePattern,
    isLoading,
    rawSearch,
    isSearching,
    organization,
    preloadCertsByUser,
    preloadedCerts,
    limitOfPreloading,
    changeLimitOfPreload: (value: number) => setLimitOfPreloading(value),
  }
}
