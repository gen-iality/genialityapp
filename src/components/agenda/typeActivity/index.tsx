import React from 'react';
// import withContext from '../../../context/withContext';
import { TypeActivityProvider } from '../../../context/typeactivity/typeActivityProvider';

import InitialView from './InitialView';

function TipeOfActivity({ eventId, activityId, activityName }) {
  return (
    <TypeActivityProvider>
      <InitialView />
    </TypeActivityProvider>
  );
}
// const TipeOfActivityWithContext = withContext(TipeOfActivity);

export default TipeOfActivity;
