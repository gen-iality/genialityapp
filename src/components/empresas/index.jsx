import { Route, Routes } from 'react-router-dom'

import CrearEditarEmpresa from './crearEditarEmpresa'
import Empresas from './empresas'
import Stands from './gestionStands'

function EmpresasRoutes({ event, matchUrl }) {
  const routeProps = {}
  return (
    <Routes>
      <Route
        exact
        path={`${matchUrl}/`}
        element={<Empresas {...routeProps} event={event} />}
      />
      <Route
        exact
        path={`${matchUrl}/crear`}
        element={<CrearEditarEmpresa {...routeProps} event={event} />}
      />
      <Route
        exact
        path={`${matchUrl}/configuration`}
        element={<Stands {...routeProps} event={event} />}
      />{' '}
      <Route
        exact
        path={`${matchUrl}/editar/:companyId`}
        element={<CrearEditarEmpresa {...routeProps} event={event} />}
      />
    </Routes>
  )
}

export default EmpresasRoutes
