import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

/** --------------------
 *  secciones del evento
 * ---------------------*/

import OfertProduts from '../components/OfertaProduct';
import AddProduct from '../components/addProduct';
import Product from '../components/product';
import Configuration from '../components/configuration';

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
