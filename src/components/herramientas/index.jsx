import { Route, Routes } from 'react-router-dom'
import Herramientas from './Herramientas'
import Herramienta from './Herramienta'

function HerramientaRoutes(props) {
  const { event } = props

  return (
    <>
      <Routes>
        <Route path={`/`} element={<Herramientas event={event} />} />
        <Route path={`/herramienta`} element={<Herramienta event={event} {...props} />} />
      </Routes>
    </>
  )
}

export default HerramientaRoutes
