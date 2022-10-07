import { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Result, Button } from 'antd';
import TicketsForm from '../../tickets/formTicket';
import { connect } from 'react-redux';
import { UseUserEvent } from '../../../context/eventUserContext';
import { UseEventContext } from '../../../context/eventContext';
import { setSectionPermissions } from '../../../redux/sectionPermissions/actions';
import { Redirect } from 'react-router-dom';
import { EventsApi } from '@helpers/request';
import ProductCard from '../producto/productCard';
import { withRouter } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import UserLoginContainer from '../UserLoginContainer';

const PageNotPermissions = (props) => {
  let EventUser = UseUserEvent();
  let EventContext = UseEventContext();
  let redirect;
  let urlsection = `/landing/${EventContext.value._id}/`;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  let history = useHistory();
  let { eventPrivate } = useHelper();

  const center = {
    margin: '30px auto',
    textAlign: 'center',
  };

  const obtenerGaleria = () => {
    setLoading(true);
    EventsApi.getProducts(EventContext.value._id).then((resp) => {
      if (resp && resp.data) {
        let threeList = resp.data.slice(0, 3);
        setProducts(threeList);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (EventUser.value == null) {
      props.setSectionPermissions({ view: true, section: props.sectionPermissions.section });
    }

    if (EventUser.value !== null) {
      redirect = 'evento';
    } else {
      obtenerGaleria();
      redirect = null;
    }
  }, []);

  return (
    <>
      {eventPrivate.private ? (
        <Card hoverable>
          <Result
            // status='403'
            title='ESTE CURSO ES PRIVADO'
            subTitle={
              <div>
                <h1 style={{ fontSize: '20px' }}>Si estas incrito, ingresa tus datos</h1>
              </div>
            }
            // extra={<Button type='primary'>Back home</Button>}
          />
          <UserLoginContainer eventId={EventContext.value._id} />
        </Card>
      ) : (
        <>
          {' '}
          {redirect !== null || (redirect !== undefined && <Redirect to={`${urlsection}${redirect}`} />)}
          {/* Sección quemada para curso de subasta sileciosa FTDJ */}
          {EventContext.value._id == '60cb7c70a9e4de51ac7945a2' && (
            <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
              {products.length > 0 && !loading && (
                <Row style={{ paddingTop: '18px' }} gutter={[16, 16]} key={'container'}>
                  {products.map((galery) => (
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8} key={galery.id}>
                      <ProductCard history={history} eventId={EventContext.value._id} galery={galery} />
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          )}
          {loading && (
            <div style={{ textAlign: 'center' }}>
              <Spin></Spin>
            </div>
          )}
          {!loading && (
            <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
              {props.sectionPermissions.view && (
                <Card>
                  <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>
                    {props.sectionPermissions.section ? (
                      <>
                        Para poder ver la sección{' '}
                        <a style={{ fontWeight: 'bold' }}>{props.sectionPermissions.section}</a> tienes que estar
                        registrado en este curso
                      </>
                    ) : (
                      <>Para poder ver esta sección tienes que estar registrado en este curso</>
                    )}
                  </h1>
                </Card>
              )}
            </Col>
          )}
          {!props.sectionPermissions.ticketview && !loading && (
            <TicketsForm setVirtualConference={props.setVirtualConference} />
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  sectionPermissions: state.viewSectionPermissions,
});

const mapDispatchToProps = {
  setSectionPermissions,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PageNotPermissions));
