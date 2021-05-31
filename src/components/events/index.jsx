import React, { Component } from 'react';
import { EventsApi } from '../../helpers/request';
import { Link } from 'react-router-dom';
import LoadingEvent from '../loaders/loadevent';
import EventCard from '../shared/eventCard';
import LogOut from '../shared/logOut';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      message: {
        class: '',
        content: '',
      },
    };
  }

  async componentDidMount() {
    try {
      const resp = await EventsApi.mine();
      this.setState({ events: resp.data, loading: false });
    } catch (e) {
      this.setState({ timeout: true, loading: false, events: [] });
    }
  }

  render() {
    const { timeout } = this.state;
    return (
      <React.Fragment>
        <section className='section'>
          {this.state.loading ? (
            <LoadingEvent />
          ) : (
            <div className='columns home is-multiline is-mobile'>
              {this.state.events.map((event) => {
                return (
                  <EventCard
                    event={event}
                    key={event._id}
                    action={''}
                    right={
                      <Link className='button is-text is-inverted is-primary' to={`event/${event._id}`}>
                        <span>Editar</span>
                      </Link>
                    }
                  />
                );
              })}
            </div>
          )}
        </section>
        {timeout && <LogOut />}
      </React.Fragment>
    );
  }
}

export default Events;
