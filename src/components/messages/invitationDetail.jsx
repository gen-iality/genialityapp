import { Fragment, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { MessageApi } from '../../helpers/request';
import MessageUser from './messageUser';
import EmailPrev from './emailPreview';
import { Row, Col, Tabs, Empty } from 'antd';
import Header from '../../antdComponents/Header';

const { TabPane } = Tabs;

const InvitationDetail = (props) => {
  const eventID = props.event._id;
  const locationState = props.location.state; //si viene item
  const [users, setUsers] = useState({});

  useEffect(() => {
    if (locationState.item._id) {
      getOne();
    }
  }, [locationState.item._id]);

  const getOne = async () => {
    const response = await MessageApi.getOne(locationState.item._id, eventID);

    setUsers(response.data);
  };

  return (
    <Fragment>
      <Header title={'Detalle de la comunicación'} back />

      <Tabs defaultActiveKey='1'>
        <TabPane tab='Reporte Envios' key='1'>
          <Row justify='center' wrap gutter={[8, 8]}>
            <Col span={22}>
              {users.length ? <MessageUser key='users' users={users} /> : <Empty description={'Sin data'} />}
            </Col>
          </Row>
        </TabPane>
        <TabPane tab='Mensaje Enviado' key='2'>
          <Row justify='center' wrap gutter={[8, 8]}>
            <Col span={22}>
              {users.length ? (
                <EmailPrev key='email' event={props.event} item={locationState.item} />
              ) : (
                <Empty description={'Sin data'} />
              )}
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

export default withRouter(InvitationDetail);
