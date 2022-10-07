import { Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
/** --------------------
 *  secciones del curso
 * ---------------------*/
import { useEventContext } from '@context/eventContext';
import DetailsProduct from './productDetails';
import ProductList from './productList';

const ProductoSectionRoutes = () => {
  let { path } = useRouteMatch();
  let cEvent = useEventContext();

  if (!cEvent.value) return <h1>Cargando...</h1>;
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <ProductList />
      </Route>
      <Route path={`${path}/:id/detailsproducts`}>
        <DetailsProduct />
      </Route>
    </Switch>
  );
};
export default withRouter(ProductoSectionRoutes);
