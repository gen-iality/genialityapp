import classNames from 'classnames';
import htmlParser from 'html-react-parser';
import { pathOr } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';
import { Component } from 'react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Exhibitor.css';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import ReactPlayer from 'react-player';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const snIcons = {
  facebook: '/exhibitors/icons/facebook.svg',
  twitter: '/exhibitors/icons/twitter.svg',
  instagram: '/exhibitors/icons/instagram.svg',
  linkedin: '/exhibitors/icons/linkedin.svg',
};

class Exhibitor extends Component {
  constructor(props) {
    super(props);
    this.handleShowGallery = this.handleShowGallery.bind(this);
    this.handleHideGallery = this.handleHideGallery.bind(this);
    this.handleShowDocuments = this.handleShowDocuments.bind(this);
    this.handleHideDocuments = this.handleHideDocuments.bind(this);
    this.handleShowServices = this.handleShowServices.bind(this);
    this.handleHideServices = this.handleHideServices.bind(this);
    this.handleShowInfo = this.handleShowInfo.bind(this);
    this.handleHideInfo = this.handleHideInfo.bind(this);
    this.handleShowVideo = this.handleShowVideo.bind(this);
    this.handleHideVideo = this.handleHideVideo.bind(this);
    this.handleHideStandImage = this.handleHideStandImage.bind(this);
    this.handleShowStandImage = this.handleShowStandImage.bind(this);
    this.state = {
      showStandImage: true,
      showGallery: false,
      showDocuments: false,
      showServices: false,
      showInfo: false,
      showVideo: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    const standImage = pathOr('', ['stand_image'], data);

    if (prevProps.data !== data && standImage) {
      this.handleShowStandImage();
    }
  }

  handleHideStandImage() {
    this.setState({ showStandImage: false });
  }

  handleShowStandImage() {
    this.setState({ showStandImage: true });
  }

  handleShowGallery() {
    this.setState({ showGallery: true });
  }

  handleHideGallery() {
    this.setState({ showGallery: false });
  }

  handleShowDocuments() {
    this.setState({ showDocuments: true });
  }

  handleHideDocuments() {
    this.setState({ showDocuments: false });
  }

  handleShowServices() {
    this.setState({ showServices: true });
  }

  handleHideServices() {
    this.setState({ showServices: false });
  }

  handleShowInfo() {
    this.setState({ showInfo: true });
  }

  handleHideInfo() {
    this.setState({ showInfo: false });
  }

  handleShowVideo() {
    this.setState({ showVideo: true });
  }

  handleHideVideo() {
    this.setState({ showVideo: false });
  }

  render() {
    const { goBack, showPrevious, showNext, data } = this.props;
    const { showStandImage } = this.state;
    const advisorName = pathOr('', ['advisor', 'name'], data);
    const advisorNumber = pathOr('', ['advisor', 'number'], data);
    const advisorImage = pathOr('', ['advisor', 'image'], data);
    const contactInfoImage = pathOr('', ['contact_info', 'image'], data);
    const contactInfoDescription = pathOr('', ['contact_info', 'description'], data);
    const gallery = pathOr([], ['gallery'], data);
    const services = pathOr([], ['services'], data);
    const socialNetworks = pathOr([], ['social_networks'], data);
    const brochure = pathOr('', ['brochure'], data);
    const webpage = pathOr('', ['webpage'], data);
    const standImage = pathOr('', ['stand_image'], data);
    const standType = pathOr('', ['stand_type'], data); // Oro, Plata,
    const videoUrl = pathOr('https://www.youtube.com/watch?v=ysz5S6PUM-U', ['video_url'], data);

    return (
      <div className={`main-stand main-stand-${standType}`}>
        <button type='button' className='main-stand-goback' onClick={goBack}>
          <img src='/exhibitors/icons/baseline_arrow_back_white_18dp.png' alt='' />
          Regresar
        </button>
        {showStandImage && (
          <button
            type='button'
            className='main-stand-go-button go-previous'
            onClick={() => [this.handleHideStandImage(), showPrevious()]}>
            {'Anterior'}
          </button>
        )}
        {showStandImage && (
          <button
            type='button'
            className='main-stand-go-button go-next'
            onClick={() => [this.handleHideStandImage(), showNext()]}>
            {'Siguiente'}
          </button>
        )}
        <div className='main-stand-social-networks'>
          {isNonEmptyArray(socialNetworks) &&
            socialNetworks.map((item, index) => (
              <a
                title={item.network}
                href={item.url}
                className='main-stand-social-networks-item'
                target='_blank'
                rel='noreferrer'
                key={`social-network-${index}`}>
                <img src={snIcons[item.network]} alt={item.network} />
              </a>
            ))}
        </div>
        <div className='main-stand-navigation'>
          {(!!contactInfoImage || !!contactInfoDescription) && (
            <div className='main-stand-navigation-item' onClick={this.handleShowInfo}>
              <div className='main-stand-navigation-item-icon'>
                <img src='/exhibitors/icons/ic_domain_24px.png' alt='' />
              </div>
              <div className='main-stand-navigation-item-label'>CONTACTO</div>
            </div>
          )}

          {standType === 'Oro' && isNonEmptyArray(gallery) && (
            <div className='main-stand-navigation-item' onClick={this.handleShowGallery}>
              <div className='main-stand-navigation-item-icon'>
                <img src='/exhibitors/icons/ic_perm_media_24px.png' alt='' />
              </div>
              <div className='main-stand-navigation-item-label'>GALERÍA</div>
            </div>
          )}

          {isNonEmptyArray(services) && (
            <div className='main-stand-navigation-item' onClick={this.handleShowServices}>
              <div className='main-stand-navigation-item-icon'>
                <img src='/exhibitors/icons/ic_card_travel_24px.png' alt='' />
              </div>
              <div className='main-stand-navigation-item-label'>SERVICIOS</div>
            </div>
          )}

          {!!brochure && (
            <a href={brochure} target='_blank' rel='noreferrer' className='main-stand-navigation-item'>
              <div className='main-stand-navigation-item-icon'>
                <img src='/exhibitors/icons/ic_library_books_24px.png' alt='' />
              </div>
              <div className='main-stand-navigation-item-label'>CATÁLOGO</div>
            </a>
          )}

          {standType === 'Oro' && !!webpage && (
            <a href={webpage} target='_blank' rel='noreferrer' className='main-stand-navigation-item'>
              <div className='main-stand-navigation-item-icon'>
                <img src='/exhibitors/icons/ic_public_24px.png' alt='' />
              </div>
              <div className='main-stand-navigation-item-label'>SITIO WEB</div>
            </a>
          )}
        </div>
        {!!advisorNumber && (
          <a
            className='main-stand-chat'
            href={'https://api.whatsapp.com/send?phone=' + advisorNumber}
            target='_blank'
            rel='noreferrer'>
            <img className='chat-image' src={advisorImage ? advisorImage : `/exhibitors/person.png`} alt='' />
            <div className='chat-message'>
              Hola soy {advisorName}, <br />
              Te puedo ayudar en algo?
            </div>
          </a>
        )}
        <div className='main-stand-module'>
          {showStandImage && (
            <div className='main-stand-module-wrap'>
              <img className='stand-image' src={standImage} alt='stand picture' />
              <div className='main-stand-play-btn' onClick={this.handleShowVideo} />
            </div>
          )}
        </div>

        {isNonEmptyArray(gallery) && (
          <div className={`main-stand-gallery ${this.state.showGallery ? 'active' : ''}`}>
            <div className='main-stand-gallery-overlay' />
            <div className='main-stand-gallery-close-window' onClick={this.handleHideGallery}>
              <img src='/exhibitors/icons/ic_close_24px.png' alt='' />
            </div>
            <div className='main-stand-gallery-container'>
              <Swiper spaceBetween={0} slidesPerView={1} navigation pagination={{ clickable: true }}>
                {gallery.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className='main-stand-gallery-slide'>
                      <img className='main-stand-gallery-slide-image' src={slide.image} alt='' />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {/* <div className={`main-stand-modal ${this.state.showDocuments ? 'active' : ''}`}>
          <div className="main-stand-modal-overlay" onClick={this.handleHideDocuments} />
          <div className={`main-stand-modal-container`}>
            <div className="main-stand-modal-header">
              <div className="main-stand-modal-header-title">Catálogos</div>
              <div className="main-stand-modal-close-window" onClick={this.handleHideDocuments}>
                <img src="/exhibitors/icons/ic_close_24px.png" alt="" />
              </div>
            </div>
            <div className="main-stand-modal-content">
              {exhibitorData.documents.map((doc, index) => (
                <div className="main-stand-documents-item" key={index}>
                  <div>{doc.name}</div>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="main-stand-documents-item-btn">
                    <img src="/exhibitors/icons/ic_dowload.png" alt="" />
                    <span>Descargar</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {isNonEmptyArray(services) && (
          <div className={`main-stand-modal ${this.state.showServices ? 'active' : ''}`}>
            <div className='main-stand-modal-overlay' onClick={this.handleHideServices} />
            <div className={`main-stand-modal-container`}>
              <div className='main-stand-modal-header'>
                <div className='main-stand-modal-header-title'>Servicios</div>
                <div className='main-stand-modal-close-window' onClick={this.handleHideServices}>
                  <img src='/exhibitors/icons/ic_close_24px.png' alt='' />
                </div>
              </div>
              <div className='main-stand-modal-content'>
                {services.map((service, index) => {
                  const infoClassName = classNames('main-stand-services-item-image', {
                    'only-image': !!service && !!service.image && !service.description,
                  });
                  const imageClassName = classNames('main-stand-services-item-info', {
                    'only-info': !!service && !!service.description && !service.image,
                  });

                  return (
                    <div className='main-stand-services-item' key={`service-item-${index}`}>
                      {!!service && !!service.image && (
                        <div className={infoClassName}>
                          <img src={service.image} alt='' />
                        </div>
                      )}
                      {!!service && !!service.description && (
                        <div className={imageClassName}>
                          <div>{htmlParser(service.description)}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className={`main-stand-modal main-stand-modal-contact-info ${this.state.showInfo ? 'active' : ''}`}>
          <div className='main-stand-modal-overlay' onClick={this.handleHideInfo} />
          <div className={`main-stand-modal-container`}>
            <div className='main-stand-modal-header'>
              <div className='main-stand-modal-header-title'>Información de contacto</div>
              <div className='main-stand-modal-close-window' onClick={this.handleHideInfo}>
                <img src='/exhibitors/icons/ic_close_24px.png' alt='' />
              </div>
            </div>
            <div className='main-stand-modal-content'>
              <div className='main-stand-contact-info'>
                {!!contactInfoImage && (
                  <div className='main-stand-contact-info-image'>
                    <img src={contactInfoImage} alt='' />
                  </div>
                )}
                <div className='main-stand-contact-info-info'>
                  {!!contactInfoDescription && (
                    <div className='main-stand-contact-info-description'>
                      <div>{htmlParser(contactInfoDescription)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`main-stand-modal main-stand-modal-video ${this.state.showVideo ? 'active' : ''}`}>
          <div className='main-stand-modal-overlay' onClick={this.handleHideVideo} />
          <div className='main-stand-modal-close-window' onClick={this.handleHideVideo}>
            <img src='/exhibitors/icons/ic_close_24px.png' alt='' />
          </div>
          <div className='main-stand-modal-video-wrap'>
            <ReactPlayer url={videoUrl} />
          </div>
        </div>
      </div>
    );
  }
}

export default Exhibitor;
