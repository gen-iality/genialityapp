import { Route, Routes, useLocation } from 'react-router-dom'
/** --------------------
 *  secciones del curso
 * ---------------------*/
import NoticiasList from './NoticiasList'

import { useEventContext } from '@context/eventContext'
import NoticiasDetailsConnect from './NoticiasDetails'

const NoticiasSectionRoutes = () => {
  const { pathname: path } = useLocation()
  const cEvent = useEventContext()

  if (!cEvent.value) return <h1>Cargando...</h1>
  return (
    <Routes>
      <Route exact path={`${path}`}>
        <NoticiasList />
      </Route>
      <Route path={`${path}/:id/detailsNoticia`}>
        <NoticiasDetailsConnect />
      </Route>
    </Routes>
  )
}
export default NoticiasSectionRoutes
