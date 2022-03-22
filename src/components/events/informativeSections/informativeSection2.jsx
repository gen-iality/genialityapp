import { Component } from 'react';
import { Card, Row, Col } from 'antd';
import Parser from 'html-react-parser';
import ReactPlayer from 'react-player';
import withContext from '../../../context/withContext';

class InformativeSection2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markup: '',
      informativeSection1: null,
    };
  }

  componentDidMount() {
    this.setState({
      markup: this.props.cEvent.value.itemsMenu.informativeSection1.markup,
      informativeSection1: this.props.cEvent.value.itemsMenu.informativeSection1,
    });
  }
  render() {
    const { markup, informativeSection1 } = this.state;

    return (
      <Row justify='center' gutter={[8, 8]} wrap>
        <Col span={23}>
          {informativeSection1 != null && (
            <div className='site-card-border-less-wrapper'>
              {this.props.cEvent.value._id != '609180c6013150612044b547' &&
                this.props.cEvent.value._id != '60797bfb2a9cc06ce973a1f4' && (
                  <Card
                    title={
                      informativeSection1 && informativeSection1.name ? informativeSection1.name : 'Sección informativa'
                    }
                    bordered={false} /* style={{ width: 1000 }} */
                  >
                    {markup != null && Parser(markup)}
                  </Card>
                )}

              {this.props.cEvent.value._id == '609180c6013150612044b547' && (
                <>
                  <h2
                    style={{ fontWeight: 700, fontSize: '23px', borderBottom: '1px solid #C0BAB9', marginTop: '25px' }}>
                    conferencia - Miguel Uribe Vender
                  </h2>

                  <iframe
                    style={{ width: '640px', height: '380px', margin: 'auto' }}
                    src='https://www.youtube.com/embed/ZD5nWJZgt2E'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen></iframe>
                  <h2
                    style={{ fontWeight: 700, fontSize: '23px', borderBottom: '1px solid #C0BAB9', marginTop: '25px' }}>
                    CoCrea
                  </h2>

                  <iframe
                    style={{ width: '640px', height: '380px', margin: 'auto' }}
                    src='https://www.youtube.com/embed/Od19Fle4q6M'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen>
                    {' '}
                  </iframe>
                  <h2
                    style={{ fontWeight: 700, fontSize: '23px', borderBottom: '1px solid #C0BAB9', marginTop: '25px' }}>
                    Martes de Oferta Naranja Ministerio de Cultura
                  </h2>

                  <iframe
                    style={{ width: '640px', height: '380px', margin: 'auto' }}
                    src='https://www.youtube.com/embed/videoseries?list=PL9wuymCs4-gOUS831iFNNZRMoOAq3jBlD'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen></iframe>

                  <h2
                    style={{ fontWeight: 700, fontSize: '23px', borderBottom: '1px solid #C0BAB9', marginTop: '25px' }}>
                    Entrénate en la Plataforma de las Ruedas de Negocio Naranja
                  </h2>

                  <iframe
                    style={{ width: '640px', height: '380px', margin: 'auto' }}
                    src='https://www.youtube.com/embed/TH_4s3fWHSQ'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen></iframe>
                </>
              )}
              {this.props.cEvent.value._id == '609180c6013150612044b547' && (
                <>
                  <h2
                    style={{ fontWeight: 700, fontSize: '23px', borderBottom: '1px solid #C0BAB9', marginTop: '25px' }}>
                    Charla con Yury Buenaventura
                  </h2>
                  <br></br>
                  <ReactPlayer
                    style={{ width: '560px', height: '445px', margin: 'auto' }}
                    url='https://vimeo.com/548970584'
                    controls
                  />
                </>
              )}

              {this.props.cEvent.value._id == '609180c6013150612044b547' && (
                <>
                  <h2
                    style={{ fontWeight: 700, fontSize: '23px', borderBottom: '1px solid #C0BAB9', marginTop: '25px' }}>
                    Charla con María Alejandra Silva de BURO
                  </h2>
                  <br></br>
                  <ReactPlayer
                    style={{ width: '560px', height: '445px', margin: 'auto' }}
                    url='https://vimeo.com/513595337'
                    controls
                  />
                </>
              )}

              {this.props.cEvent.value._id == '60797bfb2a9cc06ce973a1f4' && (
                <>
                  <iframe
                    src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/EventoAjedrez%2Freglamento.pdf?alt=media&token=5f2bc8a1-8929-4990-927d-f84d9afb2146'
                    style={{ width: 900, height: 1000, marginTop: '45px' }}></iframe>
                </>
              )}
            </div>
          )}
        </Col>
      </Row>
    );
  }
}

let InformativeSection2WithContext = withContext(InformativeSection2);
export default InformativeSection2WithContext;
