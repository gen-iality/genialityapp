import React from 'react';
import { Route, Switch, withRouter } from "react-router-dom";

import CrearEditarEmpresa from "./crearEditarEmpresa";
import Empresas from "./empresas";
import Stands from './gestionStands';

function EmpresasRoutes({ event, match }) {
  const matchUrl = match.url

  return (
    <Switch>
      <Route
        exact
        path={`${matchUrl}/`}
        render={(routeProps) => <Empresas {...routeProps} event={event} />}
      />

      <Route
        exact
        path={`${matchUrl}/crear`}
        render={(routeProps) => <CrearEditarEmpresa {...routeProps} event={event} />}
      />
       <Route
        exact
        path={`${matchUrl}/Stands`}
        render={(routeProps) => <Stands {...routeProps} event={event} />}
      />

      <Route
        exact
        path={`${matchUrl}/editar/:companyId`}
        render={(routeProps) => <CrearEditarEmpresa {...routeProps} event={event} />}
      />
    </Switch>
  );
}

export default withRouter(EmpresasRoutes);
