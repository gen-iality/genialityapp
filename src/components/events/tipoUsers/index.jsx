import { Route, Routes } from 'react-router-dom'
import TipoAsistentes from './TipoAsistentes'
import TipoAsistente from './TipoAsistente'

function TipoUsersRoutes(props) {
  const { event } = props
  return (
    <Routes>
      <Route path="/" element={<TipoAsistentes event={event} />} />
      <Route path="/tipoAsistente" element={<TipoAsistente event={event} {...props} />} />
    </Routes>
  )
}

export default TipoUsersRoutes
