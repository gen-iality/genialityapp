import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCategories } from '../redux/categories/actions';
import { fetchTypes } from '../redux/types/actions';
import loadable from '@loadable/component';
import { Layout } from 'antd';

import WithFooter from '../components/withFooter';
import { useCurrentUser } from '../context/userContext';
import { CurrentUserEventProvider } from '../context/eventUserContext';
import { CurrentEventProvider } from '../context/eventContext';
import { CurrentUserProvider } from '../context/userContext';
import { SurveysProvider } from '../context/surveysContext';
import { HelperContextProvider } from '../context/helperContext/helperProvider';
import { AgendaContextProvider } from '../context/AgendaContext';
import ModalAuth from '../components/authentication/ModalAuth';
import ModalNoRegister from '../components/authentication/ModalNoRegister';
import ModalAuthAnonymous from '@/components/authentication/ModalAuthAnonymous';
import ModalUpdate from '@/components/events/Landing/ModalUpdate';
//PAGES
const Organization = loadable(() => import('../pages/eventOrganization'));
const Home = loadable(() => import('../pages/home'));

const Landing = loadable(() => import('../components/events/Landing/landing'));
const NotFoundPage = loadable(() => import('../components/notFoundPage'));
const Header = loadable(() => import('./header'));

const MainRouter = (props) => {
  let cUser = useCurrentUser();
  useEffect(() => {
    props.dispatch(fetchCategories());
    props.dispatch(fetchTypes());
  }, [cUser.value]);

  return (
    <Router
      basename='/'
      getUserConfirmation={() => {
        /* Empty callback to block the default browser prompt, it is necessary to be able to use in custon hook RouterPrompt */
      }}>
      <main className='main'>
        <Switch>
          {/* 
           Front
           --------------
           organizaciones
           organizacion
           
           curso
           cursos

           perfildeusuario
           notfound
          */}

          <RouteContext path={['/landing/:event_id', '/event/:event_name']} component={Landing} />
          <RouteContext exact path='/organization/:id/events' component={Organization} />
          <RouteContext exact path='/organization/:id' component={Organization} />
          <RouteContext exact path='/' component={PageWithFooter} />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
    </Router>
  );
};

const RouteContext = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <CurrentEventProvider>
        <CurrentUserEventProvider>
          <CurrentUserProvider>
            <AgendaContextProvider>
              <HelperContextProvider>
                <SurveysProvider>
                  <Layout
                    style={{
                      minHeight: '100vh',
                    }}>
                    <Header />
                    <Component {...props} />
                    <ModalAuth />
                    <ModalAuthAnonymous />
                    <ModalNoRegister />
                    <ModalUpdate />
                  </Layout>
                </SurveysProvider>
              </HelperContextProvider>
            </AgendaContextProvider>
          </CurrentUserProvider>
        </CurrentUserEventProvider>
      </CurrentEventProvider>
    )}
  />
);

const PageWithFooter = () => {
  return (
    <WithFooter>
      <Home />
    </WithFooter>
  );
};

export default connect()(MainRouter);
