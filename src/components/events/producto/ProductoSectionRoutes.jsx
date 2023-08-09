import { Route, Routes, useLocation } from 'react-router-dom'
/** --------------------
 *  secciones del curso
 * ---------------------*/
import { useEventContext } from '@context/eventContext'
import DetailsProduct from './productDetails'
import ProductList from './productList'

const ProductoSectionRoutes = () => {
  const { pathname: path } = useLocation()
  const cEvent = useEventContext()

  if (!cEvent.value) return <h1>Cargando...</h1>
  return (
    <Routes>
      <Route exact path={`${path}`}>
        <ProductList />
      </Route>
      <Route path={`${path}/:id/detailsproducts`}>
        <DetailsProduct />
      </Route>
    </Routes>
  )
}
export default ProductoSectionRoutes
