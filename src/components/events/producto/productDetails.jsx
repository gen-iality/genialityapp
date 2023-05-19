import { useState, useEffect } from 'react';
import { Card, Col, Divider, Row, Space, Spin, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import { EventsApi } from '../../../helpers/request';
import { IssuesCloseOutlined } from '@ant-design/icons';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
// import { Carousel } from 'react-responsive-carousel';
import { firestore } from '../../../helpers/firebase';
import OfertaProduct from './OfertaProducto';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

// import required modules
import { Navigation, Thumbs } from 'swiper';

function DetailsProduct(props) {
  const { Title, Text } = Typography;
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [habilty, setHability] = useState();
  const [messageF, setMessage] = useState('');
  const [eventId, setEventId] = useState('');
  const [updateValue, setUpdateValue] = useState();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  //currency
  useEffect(() => {
    let idProduct = props.match.params.id;
    let eventId = props.match.params.event_id;
    firestore
      .collection('config')
      .doc(eventId)
      .onSnapshot((onSnapshot) => {
        if (onSnapshot.exists) {
          let doc = onSnapshot.data();
          setHability(doc.data.habilitar_subasta);
          setMessage(doc.data.message);
        } else {
          setHability(false);
        }
      });

    if (idProduct && eventId && (!updateValue || updateValue)) {
      setEventId(eventId);
      obtenerDetalleProduct();
    }
    async function obtenerDetalleProduct() {
      let detalleProduct = await EventsApi.getOneProduct(eventId, idProduct);
      if (Object.keys(detalleProduct).length > 0) {
        setProduct(detalleProduct);
      }
      setLoading(false);
    }
  }, [updateValue]);

  return (
    <>
      {product && !loading && (
        <Row style={{ padding: '10px' }} gutter={[8, 8]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Card
              style={{
                width: '100%',
                height: '425px',
                display: 'grid',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Swiper
                style={{
                  width: '400px',
                  height: '280px',
                  margin: '4px',
                }}
                loop={true}
                spaceBetween={1}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Thumbs]}
                freeMode={true}>
                {product &&
                  product.images &&
                  product.images
                    .filter((img) => img != null)
                    .map((image, index) => (
                      <SwiperSlide key={'image' + index}>
                        <img
                          style={{ borderRadius: '10px', objectFit: 'contain', width: '100%', height: '280px' }}
                          src={product.images[index]}
                          alt='producto'
                        />
                      </SwiperSlide>
                    ))}
              </Swiper>
              {product && product.images && product.images.filter((img) => img != null).length > 1 && (
                <Swiper
                  style={{ width: '250px', height: '120px' }}
                  onSwiper={setThumbsSwiper}
                  loop={true}
                  spaceBetween={1}
                  slidesPerView={2}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[Navigation, Thumbs]}>
                  {product &&
                    product.images &&
                    product.images
                      .filter((img) => img != null)
                      .map((image, index) => (
                        <SwiperSlide
                          key={'thumb' + index}
                          style={{ objectFit: 'contain', width: '100px', height: '100px' }}>
                          <img
                            style={{ objectFit: 'cover', width: '100px', height: '100px' }}
                            src={product.images[index]}
                            alt='thumbnail'
                          />
                        </SwiperSlide>
                      ))}
                </Swiper>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Card>
              <Space direction='vertical' style={{ width: '100%' }}>
                {/* nombre de la obra Pan */}
                <Title level={3}>{product && product.name ? product.name : 'Nombre de la obra'}</Title>
                {/* OfertaProduct "No tienes permisos para pujar sobre esta obra." Precio Inicial:
                  $ 2000 */}
                {product && (product.price || product.start_price) && (
                  <OfertaProduct
                    updateValues={setUpdateValue}
                    hability={habilty}
                    messageF={messageF}
                    product={product}
                    eventId={eventId}
                  />
                )}
                {product && product.by && product.by !== '' && (
                  <Divider orientation='left'>
                    {/* autor  */}
                    <Title style={{ marginBottom: '0px' }} level={5}>
                      Vendedor
                    </Title>
                  </Divider>
                )}
                {/* nombre del autor */}
                {product && product.by && <Text>{product && product.by ? product.by : 'Sin Autor'} </Text>}
                <Divider orientation='left'>
                  <Title level={5}>Descripción</Title>
                </Divider>
                <Text>
                  {/* descripcion  */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product && product.description ? product.description : 'Sin descripción',
                    }}></div>
                </Text>
                {/* <Row gutter={[12,12]}> 
                     <Col span={8}>
                     <span><strong>Oferta actual</strong></span>
                     <Alert style={{padding:'4px 15px'}} type="success" message={product && product.price? product.price:"Sin precio"}/>  
                     </Col>
                     <Col span={8}> 
                       <span ><strong>Valor a ofrecer</strong></span>
                       <Input type='number' style={{width:'100%'}} min='1000' max={99999999} value=''  />
                      <span style={{color:'red',fontSize:8}}>Valor a ofrecer incorrecto</span>
                     </Col>            
                   </Row> 
                    <Button type='primary' size='middle'>
                        Pujar
                    </Button> */}
              </Space>
            </Card>
          </Col>
        </Row>
      )}
      {!product && !loading && (
        <Card style={{ textAlign: 'center', marginLeft: 30, marginRight: 30, marginTop: 60 }}>
          <IssuesCloseOutlined style={{ marginRight: 20, fontSize: 20 }} />
          No existe detalle de este producto
        </Card>
      )}
      {loading && (
        <Row style={{ marginTop: 60 }}>
          <Spin style={{ margin: 'auto' }} />
        </Row>
      )}
    </>
  );
}

export default withRouter(DetailsProduct);
