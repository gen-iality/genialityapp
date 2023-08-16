import { Route, Routes } from 'react-router-dom'

import CrearEditarEmpresa from './crearEditarEmpresa'
import Empresas from './empresas'
import Stands from './gestionStands'

function EmpresasRoutes({ event }) {
  const routeProps = {}
  return (
    <Routes>
      <Route path="/" element={<Empresas {...routeProps} event={event} />} />
      <Route
        path="/crear"
        element={<CrearEditarEmpresa {...routeProps} event={event} />}
      />
      <Route path="/configuration" element={<Stands {...routeProps} event={event} />} />{' '}
      <Route
        path="/editar/:companyId"
        element={<CrearEditarEmpresa {...routeProps} event={event} />}
      />
    </Routes>
  )
}

export default EmpresasRoutes
