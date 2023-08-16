import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import Espacios from './Espacios'
import Espacio from './Espacio'

function EspacioRoutes(props) {
  const { event } = props

  return (
    <Fragment>
      <Routes>
        <Route path={`/`} element={<Espacios event={event} />} />
        <Route path={`/espacio`} element={<Espacio event={event} {...props} />} />
      </Routes>
    </Fragment>
  )
}

export default EspacioRoutes
