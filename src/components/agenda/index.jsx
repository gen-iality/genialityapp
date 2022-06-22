import { Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Agenda from './agenda';
import AgendaEdit from './edit';
import AgendaEditv2 from './editv2';
import AgendaTypeCat from './typecat';
import AgendaTypeCatCE from './AgendaTypeCatCE';
/* import AgendaEditLanguage from "./editLanguage_old";
 */
function AgendaRoutes({ ...props }) {
  const { event, match } = props;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${match.url}/`} render={() => <Agenda event={event} matchUrl={match.url} />} />
        <Route exact path={`${match.url}/actividad`} render={() => <AgendaEdit event={event} matchUrl={match.url} />} />
        <Route exact path={`${match.url}/actividadv2`} render={() => <AgendaEditv2 event={event} matchUrl={match.url} />} />
        <Route exact path={`${match.url}/tipos`} render={() => <AgendaTypeCat event={event} matchUrl={match.url} />} />
        <Route
          exact
          path={`${match.url}/categorias`}
          render={() => <AgendaTypeCat event={event} matchUrl={match.url} />}
        />
        <Route
          exact
          path={`${match.url}/:subject`}
          render={() => <AgendaTypeCatCE event={event} matchUrl={match.url} />}
        />
        {/* <Route exact path={`${match.url}/Language`} render={()=><AgendaEditLanguage event={event} matchUrl={match.url}/>}/> */}
      </Switch>
    </Fragment>
  );
}

export default withRouter(AgendaRoutes);
