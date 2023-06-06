import { Route, Switch, useRouteMatch } from 'react-router-dom'
/** --------------------
 *  secciones del curso
 * ---------------------*/
import { useEventContext } from '@context/eventContext'
import DetailsProduct from './productDetails'
import ProductList from './productList'

const ProductoSectionRoutes = () => {
  const { path } = useRouteMatch()
  const cEvent = useEventContext()

  if (!cEvent.value) return <h1>Cargando...</h1>
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <ProductList />
      </Route>
      <Route path={`${path}/:id/detailsproducts`}>
        <DetailsProduct />
      </Route>
    </Switch>
  )
}
export default ProductoSectionRoutes
