import { Route, Routes } from 'react-router-dom'

import CrearEditarEmpresa from './crearEditarEmpresa'
import Empresas from './empresas'
import Stands from './gestionStands'

function EmpresasRoutes({ event }) {
  return (
    <Routes>
      <Route path="/" element={<Empresas event={event} />} />
      <Route path="/crear" element={<CrearEditarEmpresa event={event} />} />
      <Route path="/configuration" element={<Stands event={event} />} />{' '}
      <Route path="/editar/:companyId" element={<CrearEditarEmpresa event={event} />} />
    </Routes>
  )
}

export default EmpresasRoutes
