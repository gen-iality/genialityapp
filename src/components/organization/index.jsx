import React, { useState, useEffect } from 'react';
import { Route, NavLink, Redirect, Switch, withRouter } from 'react-router-dom';
import Loading from '../loaders/loading';
import { OrganizationApi } from '../../helpers/request';
import OrganizationProfile from './profile';
import Styles from '../App/styles';
import OrgEvents from './events';
import OrgMembers from './members';
import Datos from '../events/datos';
import { Tag } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';

function Organization(props) {
   const [organization, setOrganization] = useState({});
   const [loading, setLoading] = useState({});
   const organizationId = props.match.params.id;

   async function getOrganizationData() {
      const org = await OrganizationApi.getOne(organizationId);
      setOrganization(org);
      setLoading(false);
   }
   console.log('10. organization ', organization);
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
                  <div className={`is-hidden-mobile`}>
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
                  {loading ? (
                     <Loading />
                  ) : (
                     <section className='section'>
                        <Tag color='success' icon={<DoubleRightOutlined />} style={{ marginBottom: 10, marginLeft:20 }}>
                           <a
                              target='_blank'
                              href={`${window.location.origin}/organization/${organization._id}/events
                        `}>
                              {`Ir al landing de la organización: ${organization.name}`}
                           </a>
                        </Tag>

                        <Switch>
                           <Route
                              exact
                              path={`${props.match.url}/`}
                              render={() => <Redirect to={`${props.match.url}/events`} />}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/events`}
                              render={() => <OrgEvents org={organization} />}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/information`}
                              render={() => (
                                 <OrganizationProfile org={organization} setOrganization={setOrganization} />
                              )}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/appearance`}
                              render={() => <Styles org={organization} setOrganization={setOrganization} />}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/members`}
                              render={() => <OrgMembers org={organization} url={props.match.url} />}
                           />
                           <Route
                              exact
                              path={`${props.match.url}/membersettings`}
                              render={() => <Datos org={organization} url={props.match.url} />}
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

export default withRouter(Organization);
