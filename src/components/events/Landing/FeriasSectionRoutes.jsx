import { Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
/** --------------------
 *  secciones del curso
 * ---------------------*/
import FeriasDetail from '../../events/ferias/FeriasDetail';
import FeriasList from '../../events/ferias/FeriasList';
import FeriasStand from '../../events/ferias/FeriasStand';
import { useEventContext } from '@context/eventContext';

const FeriasSectionRoutes = () => {
  let { path } = useRouteMatch();
  const cEvent = useEventContext();

  if (!cEvent.value) return <h1>Cargando...</h1>;
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <FeriasList event_id={cEvent.value._id} />
      </Route>
      <Route path={`${path}/:id/detailsCompany`}>
        <FeriasDetail eventId={cEvent.value._id} />
      </Route>
    </Switch>
  );
};
export default withRouter(FeriasSectionRoutes);
