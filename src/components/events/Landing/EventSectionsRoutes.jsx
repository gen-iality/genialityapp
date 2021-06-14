import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
/** --------------------
 *  secciones del evento
 * ---------------------*/
import DocumentsForm from '../../documents/front/documentsLanding';
import SpeakersForm from '../speakers';
import SurveyForm from '../surveys';
import CertificadoLanding from '../../certificados/cerLanding';
import FaqsForm from '../../faqsLanding';
import Partners from '../Partners';

const EventSectionRoutes = ({ event }) => {
  console.log('carajo', event);
  let { path } = useRouteMatch();
  if (!event) return <h1>Cargando...</h1>;
  return (
    <Switch>
      <Route path={`${path}/documents`}>
        <DocumentsForm event={event} />
      </Route>
      <Route path={`${path}/speakers`}>
        <SpeakersForm event={event} />
      </Route>
      <Route path={`${path}/surveys`}>
        <SurveyForm event={event} />
      </Route>
      <Route path={`${path}/partners`}>
        <Partners event={event} />
      </Route>
      <Route path={`${path}/faqs`}>
        <FaqsForm event={event} />
      </Route>

      <Route path={`${path}/certs`}>
        <h1>Certificados</h1>
        {/* <CertificadoLanding event={event} /> */}
      </Route>
    </Switch>
  );
};
export default EventSectionRoutes;
