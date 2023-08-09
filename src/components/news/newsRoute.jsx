import { Route, Routes } from 'react-router-dom'

/** --------------------
 *  secciones del curso
 * ---------------------*/
import News from './news'
/* import AddNews from './addNews_old'; */
import NewCE from './newCE'

const NewsSectionRoutes = (props) => {
  const { matchUrl } = props

  return (
    <Routes>
      <Route exact path={`${matchUrl}/`}>
        <News {...props} />
      </Route>
      <Route path={`${matchUrl}/new`}>
        <NewCE {...props} />
      </Route>
    </Routes>
  )
}
export default NewsSectionRoutes
