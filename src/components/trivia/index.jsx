import React, { Fragment } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Trivia from "./trivia";
import TriviaEdit from "./edit";
import TriviaReport from "./report";
import ReportQuestion from "./reportQuestion";

function TriviaRoutes({ ...props }) {
  const { event, match } = props;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${match.url}/`} render={() => <Trivia event={event} matchUrl={match.url} />} />
        <Route exact path={`${match.url}/encuesta`} render={() => <TriviaEdit event={event} matchUrl={match.url} />} />
        <Route exact path={`${match.url}/report`} render={() => <TriviaReport event={event} matchUrl={match.url} />} />
        <Route
          exact
          path={`${match.url}/report/:id`}
          render={() => <ReportQuestion event={event} matchUrl={match.url} />}
        />
      </Switch>
    </Fragment>
  );
}

export default withRouter(TriviaRoutes);
