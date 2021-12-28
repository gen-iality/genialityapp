import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Actions, OrganizationApi, UsersApi } from '../../helpers/request';
import { networks } from '../../helpers/constants';
import loadable from '@loadable/component';

/** Components */
const LoadingEvent = loadable(() => import('../loaders/loadevent'));
const EventCard = loadable(() => import('../shared/eventCard'));

class HomeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      user: {
        network: {},
      },
      loadingEvents: true,
    };
  }

  async componentDidMount() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const id = this.props.match.params.id;
    let type = params.get('type');
    type = type.split('\\')[1];
    //Make the request
    const query = type === 'User' ? 'users' : 'organizations';
    const resp = await Actions.get(`/api/${query}/${id}/events`, true);
    const user = type === 'User' ? await UsersApi.getProfile(id, true) : await OrganizationApi.getOne(id, true);
    user.name = user.displayName ? user.displayName : user.name ? user.name : user.email;
    user.picture = user.picture
      ? user.picture
      : user.photoUrl
      ? user.photoUrl
      : 'https://bulma.io/images/placeholders/128x128.png';
    user.network = user.network ? user.network : { facebook: '', twitter: '', instagram: '', linkedIn: '' };
    this.setState({ events: resp.data, loadingEvents: false, user });
  }

  render() {
    const { events, user, loadingEvents } = this.state;
    return (
      <section className='section home columns'>
        <aside className='is-narrow-mobile is-fullheight menu is-hidden-mobile aside column is-2'>
          <p className='menu-label'>Menú</p>
        </aside>
        <div className='dynamic-content column'>
          <div className='columns card'>
            <div className='column is-4'>
              <figure className='image is-128x128'>
                <img className='is-rounded' alt={`profile_${user.name}`} src={user.picture} />
              </figure>
              <div>
                <h3 className='title'>{user.name}</h3>
              </div>
            </div>
            <div className='column is-7'>
              <div className='columns'>
                <div className='column'>
                  <h4>Correo:</h4>
                  <h3>{user.email}</h3>
                </div>
                <div className='column'>
                  <h4>Teléfono:</h4>
                  <h3>{user.phone}</h3>
                </div>
              </div>
            </div>
            <div className='column'>
              {Object.keys(user.network).map((net, key) => {
                if (!user.network[net]) return;
                return (
                  <button
                    className={`button column is-text`}
                    key={key}
                    onClick={() => {
                      this.showNetwork(user.network[net]);
                    }}>
                    <span className={`icon is-small`}>
                      {
                        networks.find((obj) => {
                          return obj.path === net;
                        }).icon
                      }
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {loadingEvents ? (
            <LoadingEvent />
          ) : (
            <div className='columns home is-multiline is-mobile' style={{ paddingTop: '2rem' }}>
              {events.map((event) => {
                return (
                  <EventCard
                    key={event._id}
                    event={event}
                    size={'column is-half'}
                    action={{ name: 'Ver >', url: `/landing/${event._id}` }}
                    right={
                      <div className='actions is-pulled-right'>
                        <p className='is-size-7'></p>
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default withRouter(HomeProfile);
