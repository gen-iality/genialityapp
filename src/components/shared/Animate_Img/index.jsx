import { Col, Row, Button } from 'antd';
import { PlayCircleTwoTone } from '@ant-design/icons';
import ReactPlayer from 'react-player';

class AnimateImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: '',
      event: {},
      autoplay: false,
    };
    this.autoplayVideo = this.autoplayVideo.bind(this);
  }

  componentDidMount() {
    this.setState({ eventId: this.props.eventId, event: this.props.event });
  }

  autoplayVideo() {
    this.setState({ autoplay: !this.state.autoplay });
  }
  render() {
    const { event, autoplay } = this.state;
    const { showLanding } = this.props;
    return (
      <>
        {event.styles &&
          (event.styles.loader_page === 'code' ? (
            <div className='container_imgLoading'>
              <div dangerouslySetInnerHTML={{ __html: event.styles.data_loader_page }} />
              <Row justify='center'>
                <Col>
                  <Button className='button' onClick={showLanding}>
                    Entrar
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            event.styles.loader_page === 'text' && (
              <div className='container_imgLoading'>
                <ReactPlayer width='100%' height='100%' url={event.styles.data_loader_page} playing={autoplay} />
                <Row justify='center'>
                  {autoplay ? (
                    <></>
                  ) : (
                    <PlayCircleTwoTone
                      className='icono-play'
                      twoToneColor='#1cdcb7'
                      style={{ position: 'absolute', top: '50%', left: '45%', backgroundColor: '#f5f5f500' }}
                      onClick={this.autoplayVideo}
                    />
                  )}
                </Row>
                <Row justify='center'>
                  <Col>
                    <Button className='button' onClick={showLanding}>
                      Entrar
                    </Button>
                  </Col>
                </Row>
              </div>
            )
          ))}
      </>
    );
  }
}

export default AnimateImg;
