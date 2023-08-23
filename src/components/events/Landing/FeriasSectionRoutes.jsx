import { Route, Routes, useLocation } from 'react-router-dom'
/** --------------------
 *  secciones del curso
 * ---------------------*/
import FeriasDetail from '../../events/ferias/FeriasDetail'
import FeriasList from '../../events/ferias/FeriasList'
import { useEventContext } from '@context/eventContext'

const FeriasSectionRoutes = () => {
  const { pathname: path } = useLocation()
  const cEvent = useEventContext()

  if (!cEvent.value) return <h1>Cargando...</h1>
  return (
    <Routes>
      <Route exact path={`${path}`}>
        <FeriasList event_id={cEvent.value._id} />
      </Route>
      <Route path={`${path}/:id/detailsCompany`}>
        <FeriasDetail eventId={cEvent.value._id} />
      </Route>
    </Routes>
  )
}
export default FeriasSectionRoutes
