import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Moment from 'moment';
import GoogleMapReact from 'google-map-react';
import { EVIUS_GOOGLE_MAPS_KEY } from '../../helpers/constants';
import { Card } from 'antd';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class mapComponent extends Component {
  // componentDidUpdate(prevProps) {
  //   if (this.props !== prevProps) {
  //     this.setState({ props: this.props });
  //   }
  // }

  render() {
    const { event } = this.props;
    return (
      <div>
        {event.type_event === 'onlineEvent' ? (
          <></>
        ) : (
          <div>
            <Card>
              <div className='map-head'>
                <h2 className='is-size-5 has-text-left'>
                  <b>Encuentra la ubicación</b>
                </h2>
                <div className='lugar item columns'>
                  <div className='column is-12 container-icon hours has-text-left'>
                    <span className='icon is-small'>
                      <i className='far fa-clock' />
                    </span>
                    <span className='subt is-size-6 has-text-left'>
                      {''} Desde {Moment(event.hour_start).format('HH:mm')}
                    </span>
                    <span className='subt is-size-6 has-text-left'> a {Moment(event.hour_end).format('HH:mm')}</span>
                  </div>
                </div>
                {event.location && event.location.FormattedAddress && (
                  <div className='lugar item columns'>
                    <div className='column is-12 container-icon has-text-left'>
                      <span className='icon is-small'>
                        <i className='fas fa-map-marker-alt' />
                      </span>
                      <span className='has-text-left'>
                        {''} {event.venue} {event.location.FormattedAddress}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            {event.location &&
              event.location.Latitude &&
              event.location.Longitude(
                <div style={{ width: '100%', height: '250px' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: EVIUS_GOOGLE_MAPS_KEY }}
                    defaultCenter={{
                      lat: event.location.Latitude,
                      lng: event.location.Longitude,
                    }}
                    defaultZoom={15}>
                    <AnyReactComponent lat={event.location.Latitude} lng={event.location.Longitude} text='⭐' />
                  </GoogleMapReact>
                </div>
              )}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(mapComponent);
