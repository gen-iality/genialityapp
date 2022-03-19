import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

/** --------------------
 *  secciones del evento
 * ---------------------*/
import News from './news';
/* import AddNews from './addNews_old'; */
import NewCE from './newCE';

const NewsSectionRoutes = (props) => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <News {...props} />
      </Route>
      <Route path={`${path}/new`}>
        <NewCE {...props} />
      </Route>
      {/*  <Route path={`${path}/addnoticia/:id?`}>
        <AddNews {...props} />
      </Route> */}
    </Switch>
  );
};
export default withRouter(NewsSectionRoutes);
