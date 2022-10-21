import { Component } from 'react';
import './Lobby.css';
import StandsList from '../standsList';
import fachadaImg from './assets/PH_entrada_final_2021.jpeg';
import logoImg from './assets/LOGO_PH.png';
import logoFeriaImg from './assets/TITULO_MOBILE.png';
import logoFeriaInnerImg from './assets/TITULO.png';
import bgImage from './assets/FONDO_LOBBY_2021.png';
class Lobby extends Component {
  constructor(props) {
    super(props);
    this.handleHideIntro = this.handleHideIntro.bind(this);
    this.state = {
      showIntro: false,
      showStands: false,
    };
  }

  handleHideIntro() {
    this.setState({ showIntro: true });
  }

  handleShowStands() {
    this.setState({ showStands: true });
  }

  render() {
    const lobby_data = {
      info: {
        date: '26 Agosto 2021',
        time_from: '26 de Agosto 1:00 pm',
        time_to: '28 de Agosto 7:00 pm',
        city: 'Bogotá',
        type: 'CURSO VIRTUAL',
        organizer: 'Prhopio',
        logo: logoImg,
        logoFeria: logoFeriaImg,
        logoFeriaInner: logoFeriaInnerImg,
        bgImage: bgImage,
        bgIntroImage: fachadaImg,
      },
      virtual_events: [
        {
          name: 'Nombre curso',
          date: 'Junio 19',
          hour_from: '6:00AM',
          hour_to: '9:00AM',
          speaker: {
            name: 'Pablo Perez',
            image:
              'https://firebasestorage.googleapis.com/v0/b/hey-48c29.appspot.com/o/events%2FchatImage%20(1).png?alt=media&token=8b0577e2-72c8-4aa6-979c-3da53e25227f',
          },
        },
        {
          name: 'Nombre Curso',
          date: 'Junio 19',
          hour_from: '6:00AM',
          hour_to: '9:00AM',
          speaker: {
            name: 'Juan Lopez',
            image:
              'https://firebasestorage.googleapis.com/v0/b/hey-48c29.appspot.com/o/events%2FchatImage%20(1).png?alt=media&token=8b0577e2-72c8-4aa6-979c-3da53e25227f',
          },
        },
      ],
    };

    if (this.state.showStands) {
      return (
        <iframe
          style={{ width: '100%', height: '90vh' }}
          title='Congreso PH'
          src='https://standy.club/#/stand-list'
          frameBorder='0'
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen></iframe>
      );
    }

    return (
      <div
        onClick={this.handleHideIntro}
        className={`the-lobby ${this.state.showIntro ? '' : 'venue-exterior'}`}
        style={{ backgroundImage: `url("${lobby_data.info.bgImage}")` }}>
        <div
          className={`the-intro ${this.state.showIntro ? 'active' : ''}`}
          style={{ backgroundImage: `url("${lobby_data.info.bgIntroImage}")` }}></div>

        {!this.state.showIntro && (
          <div className='the-intro-access-btn-container'>
            <p
              className='the-intro-access-btn animate__animated animate__pulse animate__slower animate__infinite'
              onClick={this.handleHideIntro}>
              INGRESA AL CONGRESO
            </p>
          </div>
        )}

        <div className='the-lobby-header'>
          <div className='the-lobby-header-col-left'>
            <img src={lobby_data.info.logo} alt='' />
          </div>
          <div className='the-lobby-header-col-center'>
            <img src={this.state.showIntro ? lobby_data.info.logoFeriaInner : lobby_data.info.logoFeria} alt='' />
          </div>
          <div className='the-lobby-header-col-right'>
            <div className='the-lobby-header-general-info'>
              <div className='the-lobby-header-general-info-wrap'>
                <div className='the-lobby-header-general-info-group'>
                  <div className='the-lobby-header-general-info-group-item'>
                    <div className='the-lobby-header-general-info-group-item-icon'>
                      <img src='/lobby/ICONO_RELOJ.png' alt='' />
                    </div>
                    <div>
                      <div className='the-lobby-header-general-info-group-item-label'>DESDE</div>
                      {lobby_data.info.time_from} a {lobby_data.info.time_to}
                    </div>
                  </div>
                  <div className='the-lobby-header-general-info-group-item'>
                    <div className='the-lobby-header-general-info-group-item-icon'>
                      <img src='/lobby/ICONO_LUGAR.png' alt='' />
                    </div>
                    <div>
                      <div className='the-lobby-header-general-info-group-item-label'>{lobby_data.info.city}</div>
                    </div>
                  </div>
                  <div className='the-lobby-header-general-info-group-item'>
                    <div>
                      <div>{lobby_data.info.type}</div>
                      <div>Organizador: {lobby_data.info.organizer}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='the-lobby-video'>
          <div className='the-lobby-video-wrap-holder'>
            <div className='the-lobby-video-holder'>
              <img src='/lobby/TIRA_PANTALLA.png' alt='' />
            </div>
            <div className='the-lobby-video-holder'>
              <img src='/lobby/TIRA_PANTALLA.png' alt='' />
            </div>
          </div>
          <div className='the-lobby-video-wrap'>
            <div className='the-lobby-video-container'>
              <iframe
                title='Congreso PH'
                width='560'
                height='315'
                src='https://www.youtube.com/embed/bBu5D33dcBA'
                frameBorder='0'
                allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen></iframe>
            </div>
          </div>
        </div>

        {this.state.showIntro && (
          <div className='standlist-container'>
            <StandsList />
          </div>
        )}
      </div>
    );
  }
}
export default Lobby;
