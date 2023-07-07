const useIsDev = () => {
  if ((import.meta.env.MODE || '').includes('staging')) {
    return true
  }
  return (import.meta.env.MODE || '').includes('production')
}

export default useIsDev
