import { Route, Routes } from 'react-router-dom'

/** --------------------
 *  secciones del curso
 * ---------------------*/
import News from './news'
/* import AddNews from './addNews_old'; */
import NewCE from './newCE'

const NewsSectionRoutes = (props) => {
  return (
    <Routes>
      <Route path="/" element={<News {...props} />} />
      <Route path="/new" element={<NewCE {...props} />} />
    </Routes>
  )
}
export default NewsSectionRoutes
