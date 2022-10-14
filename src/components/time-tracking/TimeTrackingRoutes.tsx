import * as React from 'react';

import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
import { Button, Typography } from 'antd';

import TimeTracking from './TimeTracking';

function TimeTrackingRoutes({ ...props }) {
  const { event, match } = props;
  return (
    <>
      <Switch>
        <Route exact path={`${match.url}/`} render={() => <TimeTracking event={event} matchUrl={match.url} />} />
      </Switch>
    </>
  );
}

export default withRouter(TimeTrackingRoutes);
