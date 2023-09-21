import Loading from '@/components/profile/loading';
import { useSearchList } from '@/hooks/useSearchList';
import { Badge, Button, Card, Col, Empty, Row, Space, Typography } from 'antd';
import { InputSearchEvent } from './InputSearchEvent';
import EventCard from '@/components/shared/eventCard';
import { Organization } from '../types';
import { useEffect, useState } from 'react';
import { useGetEventsFreeAcces } from '../hooks/useGetEventFreeAcces';

const { Title } = Typography;

interface Props {
  eventsWithEventUser: any[];
  isLoadingOtherEvents: boolean;
  organization: Organization | null;
  setIsModalCertificatesOpen: (item: boolean) => void;
  organizationId: string;
  eventUserId: string;
}
export const MyEvents = ({
  eventsWithEventUser,
  isLoadingOtherEvents,
  organization,
  setIsModalCertificatesOpen,
  eventUserId,
  organizationId,
}: Props) => {
  const { eventsFreeAcces, isLoadingEventFreeAcces } = useGetEventsFreeAcces(organizationId, eventUserId);
  const [isFiltering, setisFiltering] = useState(true);
  const [eventFreeFiltered, setEventFreeFiltered] = useState<any[]>([]);
  const myAllEvents = [...eventsWithEventUser,...eventFreeFiltered]
  const { filteredList, setSearchTerm } = useSearchList(myAllEvents, 'name');
  
  useEffect(() => {
    if (!isLoadingEventFreeAcces) {
      setisFiltering(true);
      const eventsFreeFilter = eventsFreeAcces.filter(
        (eventFree) => !eventsWithEventUser.map((eventOfUser) => eventOfUser._id).includes(eventFree._id)
      );
      setEventFreeFiltered(eventsFreeFilter ?? []);
      setisFiltering(false);
    }
  }, [isLoadingEventFreeAcces, eventsWithEventUser]);


  return (
    <>
      <Card
        bodyStyle={{ paddingTop: '0px' }}
        headStyle={{ border: 'none' }}
        title={
          <Badge offset={[60, 22]} count={`${myAllEvents.length} Eventos`}>
            <Title level={2}>Mis eventos</Title>
          </Badge>
        }
        extra={<Space>{myAllEvents.length > 0 && <InputSearchEvent onHandled={setSearchTerm} />}</Space>}
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
              {isLoadingOtherEvents || isFiltering ? (
                <div style={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
                  <Loading />
                </div>
              ) : (
                <>
                  {filteredList && filteredList.length > 0 ? (
                    <>
                      {filteredList.length > 0 ? (
                        filteredList.map((event, index) => (
                          <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
                            <EventCard
                              bordered={false}
                              key={event._id}
                              event={event}
                              action={{ name: 'Ver', url: `landing/${event._id}` }}
                            />
                          </Col>
                        ))
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
    </>
  );
};
