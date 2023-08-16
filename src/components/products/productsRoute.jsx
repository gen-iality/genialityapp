import { Route, Routes } from 'react-router-dom'

/** --------------------
 *  secciones del curso
 * ---------------------*/
import Product from './product'
import AddProduct from './addProduct'
import Configuration from './configuration'
import OfertProduts from './oferts'

const ProductSectionRoutes = (props) => {
  return (
    <Routes>
      <Route exact path={``} element={<Product {...props} />} />
      <Route path={`addproduct/:id?`} element={<AddProduct {...props} />} />
      <Route exact path={`configuration`} element={<Configuration {...props} />} />
      <Route exact path={`:id/oferts`} element={<OfertProduts {...props} />} />
    </Routes>
  )
}
export default ProductSectionRoutes
