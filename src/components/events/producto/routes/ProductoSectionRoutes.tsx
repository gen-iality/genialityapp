import { Route, RouteComponentProps, Switch, useRouteMatch, withRouter } from 'react-router-dom';
/** --------------------
 *  secciones del evento
 * ---------------------*/
import DetailsProduct from '../components/productDetails';
import React from 'react';
import { UseEventContext } from '@/context/eventContext';
import ProductList from '../components/productList';

const ProductoSectionRoutes: React.FC<RouteComponentProps> = () => {
  let { path } = useRouteMatch();
  let cEvent = UseEventContext();

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
