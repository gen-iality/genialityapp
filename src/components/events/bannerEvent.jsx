import React from 'react';
import Moment from 'moment';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
import { EnvironmentOutlined, LaptopOutlined } from '@ant-design/icons';
import { Col } from 'antd';

let bannerEvent = ({ styles, bgImage, mobileBanner, title, ...props }) => {
  return (
    <div className='headerContainer'>
      <Col xs={0} sm={24}>
        <img src={bgImage} alt={title} />
      </Col>
      <Col xs={24} sm={0}>
        <img src={mobileBanner == null ? bgImage : mobileBanner  } alt={title} />
      </Col>
      {styles && styles.show_card_banner && styles.show_card_banner === 'true' && (
        <HeaderEventInfo title={title} {...props} />
      )}
      {/* Imagen opcional para el logo o marca del evento  */}
      {/* <div className="container-logoBanner">
                    <img src="https://storage.googleapis.com/herba-images/evius/events/97XuEjJwHIkAyoAO1PreHOMUKMgFfM6MRmyEB5PS.jpeg" alt="" />
                </div> */}
    </div>
  );
};

function HeaderEventInfo({ title, organizado, place, dateStart, dateEnd, dates, type_event }) {
  return (
    <div
      className='banner-user-text-container'
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <TweenOne className='banner-user-text'>
        {/* Fecha del evento */}
        <div>
          {dates && dates.length > 0 ? (
            <>
              {dates.map((item, key) => (
                <span key={key}>{Moment(item).format('DD MMMM') + (dates.length - 1 > key ? ', ' : '')}</span>
              ))}
            </>
          ) : (
            <>
              {dateStart === dateEnd ? (
                <span>
                  {Moment(dateStart).format('DD')}
                  {' de '} {Moment(dateEnd).format('MMMM YYYY')}
                </span>
              ) : (
                <div>
                  {Moment(dateStart).format('MMMM') === Moment(dateEnd).format('MMMM') ? (
                    <>
                      <span>Del {Moment(dateStart).format('DD')}</span>
                      <span>
                        {' '}
                        al {Moment(dateEnd).format('DD')}
                        {' de '} {Moment(dateEnd).format('MMMM YYYY')}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Del {Moment(dateStart).format('DD')}
                        {' de'} {Moment(dateStart).format('MMMM')}
                      </span>
                      <span>
                        {' '}
                        al {Moment(dateEnd).format('DD')}
                        {' de '} {Moment(dateEnd).format('MMMM YYYY')}
                      </span>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </TweenOne>

      <TweenOne className='banner-user-title' animation={{ y: 30, opacity: 0, type: 'from' }}>
        {/* Nombre del evento */}
        <span>{title}</span>
      </TweenOne>

      <TweenOne className='banner-user-text' animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}>
        {/* Quien lo organiza */}
        <div>
          <span>Organizado por: {organizado}</span>
        </div>

        {/* Lugar del evento */}
        <div>
          {type_event === 'onlineEvent' ? (
            <div>
              <span>
                <LaptopOutlined style={{ marginRight: '2%' }} />
                Virtual
              </span>
            </div>
          ) : (
            <span>
              <EnvironmentOutlined /> {place}
            </span>
          )}
        </div>
      </TweenOne>
    </div>
  );
}

// function capitalize(val) {
//     val = Moment(val).format("DD MMMM YYYY")
//     return val.toLowerCase()
//         .trim()
//         .split(' ')
//         .map(v => v[0].toUpperCase() + v.substr(1))
//         .join(' ');
// }

// function capitalizeMont(val) {
//     val = Moment(val).format("MMMM YYYY")
//     return val.toLowerCase()
//         .trim()
//         .split(' ')
//         .map(v => v[0].toUpperCase() + v.substr(1))
//         .join(' ');
// }

export default bannerEvent;
