import React from 'react';
import {BrowserRouter as Router, Route, Switch, useRouteMatch} from 'react-router-dom';
import { withRouter } from 'react-router-dom';

/** --------------------
 *  secciones del evento
 * ---------------------*/
import Product from './product';
import AddProduct from './addProduct';
import Configuration from './configuration';

const ProductSectionRoutes = (props) => 
{
    let { path } = useRouteMatch();  
  // console.log("10. path ", path)
  // console.log("10. props ", props)
  return (    
    <Switch> 
    <Route exact path={`${path}/`}>         
         <Product {...props}/>
     </Route>       
      <Route path={`${path}/addproduct/:id?`}>
       <AddProduct {...props} />
      </Route>
      <Route exact path={`${path}/configuration`}>
       <Configuration {...props} />
      </Route>         
    </Switch>
    
  );
};
export default withRouter(ProductSectionRoutes);