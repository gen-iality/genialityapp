import { withRouter } from 'react-router-dom';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { useRequest } from '../../services/useRequest';
import { useEffect, useState } from 'react';
import ModalFeedback from '@/components/authentication/ModalFeedback';
import { Col, Row, Typography, Button, Space, Result } from 'antd';
import LoadingEvent from '@/components/loaders/loadevent';
import ErrorServe from '@/components/modal/serverError';
import EventCard from '@/components/shared/eventCard';
import { useApiMultiple } from '@/services/hooks/useApiMultiple';
Moment.locale('es');
momentLocalizer();

const Home = () => {
  let { isLoading, isError, isSuccess, responseData, useResponse, handleRequest } = useApiMultiple();

  const [typeEvent, settypeEvent] = useState<string>('nextEvents');
  const [hasMore, sethasMore] = useState(false);
  const [pagebyTypevent, setpagebyTypevent] = useState({
    nextEvents: 10,
    oldEvents: 10,
  });

  useEffect(() => {
    handleRequest({
      requests: [
        useRequest.Events.getNextEvents(pagebyTypevent.nextEvents),
        useRequest.Events.getOldEvents(pagebyTypevent.oldEvents),
      ],
      keys: ['nextEvents', 'oldEvents'],
      methods: ['get', 'get'],
      withCredentials: [true, true],
      payloads: [{}, {}],
    });
  }, []);

  const SeeMoreEvents = () => {
    switch (typeEvent) {
      case 'nextEvents':
        setpagebyTypevent({
          ...pagebyTypevent,
          nextEvents: pagebyTypevent.nextEvents + 10,
        });
        break;
      case 'oldEvents':
        setpagebyTypevent({
          ...pagebyTypevent,
          oldEvents: pagebyTypevent.oldEvents + 10,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <ModalFeedback />
      <Row gutter={[16, 16]} wrap>
        <Col span={24}>
          <Typography.Title level={1}>Eventos</Typography.Title>
        </Col>
        <Col span={24}>
          <Space wrap>
            <Button
              onClick={() => settypeEvent('nextEvents')}
              type={typeEvent === 'nextEvents' ? 'primary' : 'text'}
              size='large'
              shape='round'>
              Próximos
            </Button>
            <Button
              onClick={() => settypeEvent('oldEvents')}
              type={typeEvent === 'oldEvents' ? 'primary' : 'text'}
              size='large'
              shape='round'>
              Pasados
            </Button>
          </Space>
        </Col>
        <Col span={24}>
          <section className='home'>
            <div className='dynamic-content'>
              {isLoading ? (
                <LoadingEvent />
              ) : (
                <Row gutter={[16, 16]}>
                  {isSuccess && useResponse(typeEvent)?.length <= 0 ? (
                    <Row justify='center' align='middle' style={{ width: '100%', height: '400px' }}>
                      <Result title={'No hay eventos próximos'} />
                    </Row>
                  ) : (
                    useResponse(typeEvent)?.map((event, key) => {
                      return (
                        <Col key={key} xs={24} sm={12} md={12} lg={8} xl={6}>
                          <EventCard
                            bordered={false}
                            key={key}
                            event={event}
                            action={{
                              name: 'Ver',
                              url: `event/1`,
                            }}
                          />
                        </Col>
                      );
                    })
                  )}
                </Row>
              )}
              {hasMore === true && useResponse(typeEvent)?.length > 10 ? (
                <Button size='large' block loading={isLoading} onClick={() => SeeMoreEvents()}>
                  {!isLoading ? 'Ver más'.toUpperCase() : 'Cargando...'.toUpperCase()}
                </Button>
              ) : typeEvent === 'next' ? (
                isLoading && 'Buscando...'
              ) : (
                isSuccess &&
                useResponse(typeEvent)?.length > 0 && (
                  <Button disabled block>
                    {isLoading ? 'Buscando...' : 'No hay más eventos por mostrar'}
                  </Button>
                )
              )}
            </div>
          </section>
        </Col>
      </Row>

      {isError.status && <ErrorServe errorData={{}} />}
    </div>
  );
};

export default withRouter(Home);
