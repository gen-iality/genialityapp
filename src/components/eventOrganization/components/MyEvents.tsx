import { useState } from 'react';
import { useSearchList } from '@/hooks/useSearchList';
import { Badge, Button, Card, Col, Empty, Row, Space, Typography, Grid } from 'antd';
import { InputSearchEvent } from './InputSearchEvent';
import EventCard from '@/components/shared/eventCard';
import { IOrganization } from '../types';
import { DispatchMessageService } from '@/context/MessageService';
import LoadingCard from './LoadingCard';
import { useGetMyEventsIntoOrganization } from '../hooks/useGetMyEventsIntoOrganization';
import { createEventUserFree } from '../services/landing-organizations.service';

const { Title } = Typography;
const { useBreakpoint } = Grid;
interface Props {
  organization: IOrganization | null;
  openCertificates: () => void;
  organizationId: string;
  cUser: any;
  myOrgUser: any;
}
export const MyEvents = ({ organization, openCertificates, myOrgUser, organizationId, cUser }: Props) => {
  const screens = useBreakpoint();
  const { isLoadingMyEvents, myEventsIntoOrganization } = useGetMyEventsIntoOrganization({ organizationId });
  const {
    filteredList: myEventsIntoOrganizationfiltered,
    setSearchTerm: setSearchTermMyEventsIntoOrganization,
  } = useSearchList(myEventsIntoOrganization, 'name');

  const [isRegisteringEventUser, setIsRegisteringEventUser] = useState(false);

  const redirectToEventFreeAcces = async (event: any) => {
    try {
      setIsRegisteringEventUser(true);
      const dataNewUser = {
        names: cUser.value?.names,
        email: cUser.value?.email,
        ...myOrgUser?.properties,
      };
      const resUser = await createEventUserFree(dataNewUser, event._id);

      if (resUser) {
        window.location.pathname = `/landing/${event._id}`;
      }
    } catch (error) {
      return DispatchMessageService({
        action: 'show',
        msj: 'A ocurrido un error al ingresar al evento, vuelva a intentarlo',
        type: 'warning',
      });
    } finally {
      setIsRegisteringEventUser(false);
    }
  };

  return (
    <>
      {myOrgUser && (
        <Card
          bodyStyle={{ paddingTop: '0px' }}
          headStyle={{ border: 'none' }}
          style={{ width: '100%', borderRadius: 20 }}
          title={
            <Badge offset={[60, 22]} count={`${myEventsIntoOrganization.length} Eventos`}>
              <Title level={screens.xs ? 4 : 2}>Mis eventos</Title>
            </Badge>
          }
          extra={
            myEventsIntoOrganization.length > 0 && (
              <Space>
                <InputSearchEvent
                  onHandled={(serchTerm) => {
                    setSearchTermMyEventsIntoOrganization(serchTerm);
                  }}
                />
              </Space>
            )
          }>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              {organization?.show_my_certificates && myEventsIntoOrganization.length > 0 && (
                <Button size='large' type='default' onClick={() => openCertificates()}>
                  Mis certificados
                </Button>
              )}
            </Col>
            <Col span={24}>
              <Row style={{ overflowY: 'auto', minHeight: '300px', maxHeight: '500px' }} gutter={[16, 16]}>
                {isLoadingMyEvents ? (
                  Array.from({ length: 6 }).map((item) => <LoadingCard />)
                ) : (
                  <>
                    {myEventsIntoOrganization.length > 0 ? (
                      <>
                        {myEventsIntoOrganizationfiltered.length > 0 ? (
                          <>
                            {myEventsIntoOrganizationfiltered.map((event, index) => {
                              if (event.free_acces) {
                                return (
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
                                );
                              } else {
                                return (
                                  <Col key={event._id} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
                                    <EventCard
                                      bordered={false}
                                      key={event._id}
                                      event={event}
                                      action={{ name: 'Ver', url: `landing/${event._id}` }}
                                    />
                                  </Col>
                                );
                              }
                            })}
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
