import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

/** --------------------
 *  secciones del curso
 * ---------------------*/
import Product from './product';
import AddProduct from './addProduct';
import Configuration from './configuration';
import OfertProduts from './oferts';

const ProductSectionRoutes = (props) => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <Product {...props} />
      </Route>
      <Route path={`${path}/addproduct/:id?`}>
        <AddProduct {...props} />
      </Route>
      <Route exact path={`${path}/configuration`}>
        <Configuration {...props} />
      </Route>
      <Route exact path={`${path}/:id/oferts`}>
        <OfertProduts {...props} />
      </Route>
    </Switch>
  );
};
export default withRouter(ProductSectionRoutes);
