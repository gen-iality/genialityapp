import { Route, Routes } from 'react-router-dom'
import Herramientas from './Herramientas'
import Herramienta from './Herramienta'

function HerramientaRoutes(props) {
  const { event, matchUrl } = props

  return (
    <>
      <Routes>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <Herramientas event={event} parentUrl={matchUrl} />}
        />
        <Route
          exact
          path={`${matchUrl}/herramienta`}
          render={() => <Herramienta event={event} parentUrl={matchUrl} {...props} />}
        />
      </Routes>
    </>
  )
}

export default HerramientaRoutes
