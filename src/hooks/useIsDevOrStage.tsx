/**
 * An object with flag to check if the running mode is development or staging or neither
 * @returns `{isDev: boolean, isStage: boolean}`
 */
const useIsDevOrStage = () => {
  const mode = (import.meta.env.MODE || '').toLowerCase()

  const isDev =
    mode.includes('development') ||
    (!mode.includes('production') && !mode.includes('stage'))

  const isStage =
    mode.includes('stage') ||
    (!mode.includes('production') && !mode.includes('development'))

  return {
    isDev,
    isStage,
  }
}

export default useIsDevOrStage
