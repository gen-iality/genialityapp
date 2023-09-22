import { useState } from 'react';
import Loading from '@/components/profile/loading';
import { useSearchList } from '@/hooks/useSearchList';
import { Badge, Button, Card, Col, Empty, Row, Space, Typography } from 'antd';
import { InputSearchEvent } from './InputSearchEvent';
import EventCard from '@/components/shared/eventCard';
import { Organization } from '../types';
import { useGetEventsFreeAcces } from '../hooks/useGetEventFreeAcces';
import createEventUser from '@/components/authentication/services/RegisterUserToEvent';
import { useGetMyOrgUser } from '@/hooks/useGetMyOrgUser';
import { notification } from 'antd';
import { useFilterFreeEventInMyEvents } from '../hooks/useFilterFreeEventInMyEvents';

const { Title } = Typography;

interface Props {
  eventsWithEventUser: any[];
  isLoadingOtherEvents: boolean;
  organization: Organization | null;
  setIsModalCertificatesOpen: (item: boolean) => void;
  organizationId: string;
  cUser: any;
}
export const MyEvents = ({
  eventsWithEventUser,
  isLoadingOtherEvents,
  organization,
  setIsModalCertificatesOpen,
  organizationId,
  cUser,
}: Props) => {
  const { eventsFreeAcces, isLoadingEventFreeAcces } = useGetEventsFreeAcces(organizationId);
  const { myUserOrg, isLoadingMyUserOrg } = useGetMyOrgUser(organizationId);
  const { eventFreeFiltered, isFiltering } = useFilterFreeEventInMyEvents(
    eventsFreeAcces,
    eventsWithEventUser,
    myUserOrg,
    !isLoadingEventFreeAcces && !isLoadingMyUserOrg
  );
  const myAllEvents = [...eventsWithEventUser, ...eventFreeFiltered];

  const { filteredList: eventsWithUserfiltered, setSearchTerm: setSearchTermEventWithUser } = useSearchList(
    eventsWithEventUser,
    'name'
  );
  const { filteredList: eventsFreeFiltered, setSearchTerm: setSearchTermEventsFree } = useSearchList(
    eventFreeFiltered,
    'name'
  );

  const [isRegisteringEventUser, setIsRegisteringEventUser] = useState(false);

  const redirectToEventFreeAcces = async (event: any) => {
    try {
      setIsRegisteringEventUser(true);
      notification.open({
        message: 'Redirigiendo',
        description: `Se esta redirigiendo al evento ${event.name}`,
      });
      const resUser = await createEventUser(
        {
          names: cUser.value?.names,
          email: cUser.value?.email,
          password: cUser.value?.password,
          picture: cUser.value?.picture,
        },
        myUserOrg?.properties ?? {},
        { value: { _id: event._id } }
      );
      if (resUser) {
        window.location.pathname = `/landing/${event._id}`;
      }
    } catch (error) {
    } finally {
      setIsRegisteringEventUser(false);
    }
  };

  return (
    <>
      {myUserOrg && (
        <Card
          bodyStyle={{ paddingTop: '0px' }}
          headStyle={{ border: 'none' }}
          title={
            <Badge offset={[60, 22]} count={`${myAllEvents.length} Eventos`}>
              <Title level={2}>Mis eventos</Title>
            </Badge>
          }
          extra={
            <Space>
              {myAllEvents.length > 0 && (
                <InputSearchEvent
                  onHandled={(serchTerm) => {
                    setSearchTermEventWithUser(serchTerm);
                    setSearchTermEventsFree(serchTerm);
                  }}
                />
              )}
            </Space>
          }
          style={{ width: '100%', borderRadius: 20 }}>
          <Row gutter={[0, 32]}>
            <Col span={24}>
              {organization?.show_my_certificates && (
                <Button size='large' type='default' onClick={() => setIsModalCertificatesOpen(true)}>
                  Mis certificados
                </Button>
              )}
            </Col>
            <Col span={24}>
              <Row gutter={[16, 16]}>
                {isLoadingOtherEvents || isLoadingEventFreeAcces || isFiltering || isLoadingMyUserOrg ? (
                  <div style={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
                    <Loading />
                  </div>
                ) : (
                  <>
                    {(eventsFreeFiltered || eventsWithUserfiltered) &&
                    (eventsFreeFiltered.length > 0 || eventsWithUserfiltered.length > 0) ? (
                      <>
                        {(eventsWithUserfiltered.length > 0 || eventsFreeFiltered.length > 0)? (
                          <>
                            {eventsWithUserfiltered.map((event, index) => (
                              <Col key={event._id} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
                                <EventCard
                                  bordered={false}
                                  key={event._id}
                                  event={event}
                                  action={{ name: 'Ver', url: `landing/${event._id}` }}
                                />
                              </Col>
                            ))}
                            {eventsFreeFiltered.map((event, index) => (
                              <Col
                                key={event._id}
                                xs={24}
                                sm={12}
                                md={12}
                                lg={8}
                                xl={6}
                                xxl={4}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  if (!isRegisteringEventUser) redirectToEventFreeAcces(event);
                                }}>
                                <div style={{ pointerEvents: 'none' }}>
                                  <EventCard
                                    bordered={false}
                                    key={event._id}
                                    event={event}
                                    action={{ name: 'Ver', url: `landing/${event._id}` }}
                                  />
                                </div>
                              </Col>
                            ))}
                          </>
                        ) : (
                          <div
                            style={{
                              height: '250px',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Empty description='No se encontraron tus eventos con ese nombre' />
                          </div>
                        )}
                      </>
                    ) : (
                      <div
                        style={{
                          height: '250px',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Empty description='No estas inscritos en otros eventos' />
                      </div>
                    )}
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
};
