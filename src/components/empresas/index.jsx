import { Route, Routes } from 'react-router-dom'

import CrearEditarEmpresa from './crearEditarEmpresa'
import Empresas from './empresas'
import Stands from './gestionStands'

function EmpresasRoutes({ event, matchUrl }) {
  return (
    <Routes>
      <Route
        exact
        path={`${matchUrl}/`}
        render={(routeProps) => <Empresas {...routeProps} event={event} />}
      />
      <Route
        exact
        path={`${matchUrl}/crear`}
        render={(routeProps) => <CrearEditarEmpresa {...routeProps} a={routeProps.} event={event} />}
      />
      <Route
        exact
        path={`${matchUrl}/configuration`}
        render={(routeProps) => <Stands {...routeProps} event={event} />}
      />{' '}
      <Route
        exact
        path={`${matchUrl}/editar/:companyId`}
        render={(routeProps) => <CrearEditarEmpresa {...routeProps} event={event} />}
      />
    </Routes>
  )
}

export default EmpresasRoutes
