import React, { useState, useEffect } from 'react';
import { Route, NavLink, Redirect, Switch, withRouter } from 'react-router-dom';
import Loading from '../loaders/loading';
import { OrganizationApi } from '../../helpers/request';
import LogOut from '../shared/logOut';
import OrganizationProfile from './profile';
import Styles from '../App/styles';
import Properties from './properties';
import OrgUsers from './users';
import OrgEvents from './events';

function Organization(props) {
   const [organization, setOrganization] = useState({});
   const [loading, setLoading] = useState({});
   const organizationId = props.match.params.id;

   async function getOrganizationData() {
      const org = await OrganizationApi.getOne(organizationId);
      setOrganization(org);
      setLoading(false);
   }

   useEffect(() => {
      getOrganizationData();
   }, []);

   return (
      <>
         {loading ? (
            <Loading />
         ) : (
            <section className='columns'>
               <aside className='column menu event-aside is-2 has-text-weight-bold'>
                  <p className='subtitle'>Organizacion:</p>
                  <div className={`is-hidden-mobile`}>
                     <p className='menu-label has-text-centered-mobile'>
                        <NavLink
                           className='item'
                           // onClick={this.handleClick}
                           activeClassName={'active'}
                           to={`${props.match.url}/information`}>
                           Información
                        </NavLink>
                     </p>
                     <p className='menu-label has-text-centered-mobile'>
                        <NavLink
                           className='item'
                           // onClick={this.handleClick}
                           activeClassName={'active'}
                           to={`${props.match.url}/appearance`}>
                           Apariencia
                        </NavLink>
                     </p>
                     <p className='menu-label has-text-centered-mobile'>
                        <NavLink
                           className='item'
                           // onClick={this.handleClick}
                           activeClassName={'active'}
                           to={`${props.match.url}/events`}>
                           Eventos
                        </NavLink>
                     </p>
                     <p className='menu-label has-text-centered-mobile'>
                        <NavLink
                           className='item'
                           // onClick={this.handleClick}
                           activeClassName={'active'}
                           to={`${props.match.url}/members`}>
                           Miembros
                        </NavLink>
                     </p>
                     <p className='menu-label has-text-centered-mobile'>
                        <NavLink
                           className='item'
                           // onClick={this.handleClick}
                           activeClassName={'active'}
                           to={`${props.match.url}/membersettings`}>
                           Configuración miembros
                        </NavLink>
                     </p>
                  </div>
               </aside>
               <div className='column is-10'>
                  {props.loading ? (
                     <p>Cargando</p>
                  ) : (
                     <section className='section'>
                        <Switch>
                           <Route
                              exact
                              path={`${props.match.url}/`}
                              render={() => <Redirect to={`${props.match.url}/information`} />}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/information`}
                              render={() => <OrganizationProfile org={organization} />}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/appearance`}
                              render={() => (
                                 <Styles org={organization} />
                              )}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/events`}
                              render={() => (
                                 // <OrgEvents org={organization} />
                                 <h1>events</h1>
                              )}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/members`}
                              // component={OrgUsers}
                              render={() => (
                                 // <OrgEvents org={organization} />
                                 <h1>members</h1>
                              )}
                              org={organization}
                              url={props.match.url}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/membersettings`}
                              // component={OrgUsers}
                              render={() => (
                                 // <OrgEvents org={organization} />
                                 <h1>membersettings</h1>
                              )}
                              org={organization}
                              url={props.match.url}
                           />
                           <Route component={NoMatch} />
                        </Switch>
                     </section>
                  )}
               </div>
            </section>
         )}
      </>
   );
}

function NoMatch({ location }) {
   return (
      <div>
         <h3>
            No match for <code>{location.pathname}</code>
         </h3>
      </div>
   );
}

const Protected = ({ component: Component, org, url, ...rest }) => (
   <Route
      {...rest}
      render={(props) =>
         org.user_properties && org.user_properties.length > 0 ? (
            <Component {...props} org={org} />
         ) : (
            <Redirect push to={`${url}/profile`} />
         )
      }
   />
);

export default withRouter(Organization);
