import { Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

/** --------------------
 *  secciones del curso
 * ---------------------*/
import Product from './product'
import AddProduct from './addProduct'
import Configuration from './configuration'
import OfertProduts from './oferts'

const ProductSectionRoutes = (props) => {
  const { matchUrl } = props

  return (
    <Switch>
      <Route exact path={`${matchUrl}/`}>
        <Product {...props} />
      </Route>
      <Route path={`${matchUrl}/addproduct/:id?`}>
        <AddProduct {...props} />
      </Route>
      <Route exact path={`${matchUrl}/configuration`}>
        <Configuration {...props} />
      </Route>
      <Route exact path={`${matchUrl}/:id/oferts`}>
        <OfertProduts {...props} />
      </Route>
    </Switch>
  )
}
export default withRouter(ProductSectionRoutes)
