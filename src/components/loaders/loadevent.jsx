import React, { Component } from 'react';
import EventImage from '../../eventimage.png';

class LoadingEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const events = [0, 1, 2, 3, 4, 5, 6, 7];
    return (
      <div className='columns home is-multiline'>
        {events.map((event, key) => {
          return (
            <div className='column is-one-thirds-mobile is-two-thirds-tablet is-one-quarter-widescreen' key={key}>
              <div className='card'>
                <div className='card-image'>
                  <figure className='image is-16by9'>
                    <img src={EventImage} alt='Evius.co' />
                  </figure>
                </div>
                <div className='card-content'>
                  <div className='content'>
                    <div className='event-loading'>
                      <div className='bounce1' />
                      <div className='bounce2' />
                      <div className='bounce3' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default LoadingEvent;
