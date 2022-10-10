import { Divider, List, Typography, Button, Spin, Badge, Space } from 'antd';
import { ReadFilled, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import AccessPointIcon from '@2fd/ant-design-icons/lib/AccessPoint';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AgendaApi } from '@/helpers/request';
import dayjs from 'dayjs';
import { ExtendedAgendaType } from '@/Utilities/types/AgendaType';
import { ActivityType } from '@/context/activityType/types/activityType';
import { firestore } from '@/helpers/firebase';
import { ActivityCustomIcon } from './ActivityCustomIcon';
import { activityContentValues } from '@/context/activityType/constants/ui';
import QuizProgress from '@/components/quiz/QuizProgress';
import { useCurrentUser } from '@context/userContext';
import Service from '@components/agenda/roomManager/service';
import { DeleteActivitiesTakenButton } from './DeleteActivitiesTakenButton';
import { getRef as getSurveyStatusRef } from '@components/events/surveys/services/surveyStatus';
import { getAnswersRef, getUserProgressRef } from '@components/events/surveys/services/surveys';

type TruncatedAgenda = {
  title: string;
  type?: ActivityType.ContentValue;
  timeString: string;
  link: string;
  Component?: any;
  Component2?: any;
  DeleteSurveyAnswersButton?: any;
  DeleteActivitiesTakenButton?: any;
  RibbonComponent: any;
};

interface ActivitiesListProps {
  eventId: string;
  cEventUserId?: string;
  agendaList?: ExtendedAgendaType[]; // If parent has this, why have we to re-do?
  setActivitiesAttendee?: any;
}

const ActivitiesList = (props: ActivitiesListProps) => {
  const {
    eventId, // The event ID
    cEventUserId, // The event user ID
    setActivitiesAttendee,
  } = props;

  const service = new Service(firestore);

  const [isLoading, setIsLoading] = useState(true);
  const [truncatedAgendaList, setTruncatedAgendaList] = useState<TruncatedAgenda[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);

  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!eventId) return;
    // if (!cEventUserId) return;

    (async () => {
      setIsLoading(true);
      setTruncatedAgendaList([]);

      let agendaList: ExtendedAgendaType[] = [];
      if (props.agendaList === undefined) {
        const { data } = (await AgendaApi.byEvent(eventId)) as { data: ExtendedAgendaType[] };
        agendaList = data;
      } else {
        agendaList = props.agendaList;
      }

      setTruncatedAgendaList([
        ...agendaList.map((agenda) => {
          // Logic here
          let diff = Math.floor(Math.random() * 60 * 60);

          try {
            diff = dayjs(agenda.datetime_end).diff(dayjs(agenda.datetime_start));
          } catch (err) {
            console.error(err);
          }

          const result: TruncatedAgenda = {
            title: agenda.name,
            type: agenda.type?.name as ActivityType.ContentValue,
            timeString: dayjs(diff)
              .format('h:mm')
              .concat(' min'),
            link: `/landing/${eventId}/activity/${agenda._id}`,
            Component: () => {
              const [isTaken, setIsTaken] = useState(false);
              useEffect(() => {
                if (!cEventUserId) return;
                (async () => {
                  console.log('item._id', agenda._id);
                  let activity_attendee = await firestore
                    .collection(`${agenda._id}_event_attendees`)
                    .doc(cEventUserId)
                    .get(); //checkedin_at
                  if (activity_attendee && activity_attendee.exists) {
                    // If this activity existes, then it means the lesson was taken
                    setIsTaken(activity_attendee.data()?.checked_in);
                  }
                })();
              }, [cEventUserId]);
              if (isTaken) return <Badge style={{ backgroundColor: '#339D25' }} count='Visto' />;
              return <></>;
            },
            Component2: ({ userId }: { userId: string }) => {
              if (![activityContentValues.quizing, activityContentValues.survey].includes(agenda.type?.name as any))
                return <></>;

              const [surveyId, setSurveyId] = useState<string | undefined>();

              useEffect(() => {
                (async () => {
                  const document = await firestore
                    .collection('events')
                    .doc(eventId)
                    .collection('activities')
                    .doc(agenda._id)
                    .get();
                  const activity = document.data();
                  console.log('This activity is', activity);
                  if (!activity) return;
                  const meetingId = activity?.meeting_id;
                  if (!meetingId) {
                    console.warn(
                      'without meetingId eventId',
                      eventId,
                      ', agendaId',
                      agenda._id,
                      ', activity',
                      activity,
                      ', meetingId',
                      meetingId,
                    );
                    return;
                  }
                  setSurveyId(meetingId);
                })();
              }, []);
              if (cEventUserId && surveyId) {
                return <QuizProgress short eventId={eventId} userId={userId} surveyId={surveyId} />;
              }
              return <></>;
            },
            DeleteSurveyAnswersButton: ({ userId }: { userId: string }) => {
              if (![activityContentValues.quizing, activityContentValues.survey].includes(agenda.type?.name as any))
                return <></>;

              const [surveyId, setSurveyId] = useState<string | undefined>();
              const [isDeleted, setIsDeleted] = useState(false);
              const [isDeleting, setIsDeleting] = useState(false);

              useEffect(() => {
                (async () => {
                  const document = await firestore
                    .collection('events')
                    .doc(eventId)
                    .collection('activities')
                    .doc(agenda._id)
                    .get();
                  const activity = document.data();
                  console.log('This activity is', activity);
                  if (!activity) return;
                  const meetingId = activity?.meeting_id;
                  if (!meetingId) {
                    console.warn(
                      'without meetingId eventId',
                      eventId,
                      ', agendaId',
                      agenda._id,
                      ', activity',
                      activity,
                      ', meetingId',
                      meetingId,
                    );
                    return;
                  }
                  setSurveyId(meetingId);
                })();
              }, []);

              async function deleteSurveyAnswers(surveyId: any, userId: any) {
                // No se eliminan las respuestas, con solo eliminar el userProgress y surveyStatus el usuario puede volver a contestar la encuesta, sobreescribiendo las anteriores respuestas.
                console.log('700.surveyId', surveyId);
                console.log('700.userId', userId);

                await getUserProgressRef(surveyId, userId).delete();
                await getSurveyStatusRef(surveyId, userId).delete();
                await getAnswersRef(surveyId, userId).delete();
              }

              if (userId && surveyId) {
                return (
                  <Button
                    style={{
                      background: isDeleted ? '#947A7A' : '#B8415A',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                      height: '20px',
                      lineHeight: '20px',
                      borderRadius: '10px',
                      marginLeft: '2px',
                    }}
                    disabled={isDeleted}
                    size='small'
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleting(true);
                      deleteSurveyAnswers(surveyId, userId).then(() => {
                        setIsDeleted(true);
                        setIsDeleting(false);
                      });
                    }}
                  >
                    {isDeleted ? 'Respuestas eliminadas' : 'Eliminar respuestas'}
                    {isDeleting && (
                      <>
                        <LoadingOutlined style={{ fontSize: '12px', color: '#FFF', marginLeft: '10px' }} />
                      </>
                    )}
                  </Button>
                );
              }
              return <></>;
            },
            RibbonComponent: ({ children }: { children: any }) => {
              const [isLive, setIsLive] = useState(false);
              useEffect(() => {
                service.getConfiguration(eventId, agenda._id).then((config) => {
                  const is = config?.habilitar_ingreso === 'open_meeting_room';
                  console.log('isLive change to:', is);
                  setIsLive(is);
                });
              }, [agenda._id]);

              return (
                <Badge.Ribbon
                  className='animate__animated animate__bounceIn animate__delay-2s'
                  placement={'end'}
                  style={{ height: 'auto', padding: '3px', top: -5, lineHeight: '10px' }}
                  color={isLive ? 'red' : 'transparent'}
                  text={
                    isLive ? (
                      <Space direction='horizontal' style={{ padding: 0 }}>
                        <AccessPointIcon
                          className='animate__animated animate__heartBeat animate__infinite animate__slower'
                          style={{ fontSize: '12px' }}
                        />
                        <span style={{ textAlign: 'center', fontSize: '12px' }}>
                          {/* {<FormattedMessage id='live' defaultMessage='En vivo' />} */}
                          En Vivo
                        </span>
                      </Space>
                    ) : (
                      ''
                    )
                  }
                >
                  {children}
                </Badge.Ribbon>
              );
            },
          };
          return result;
        }),
      ]);

      setIsLoading(false);
    })();
  }, [eventId, cEventUserId, isDeleted]);

  if (isLoading) return <Spin />;

  return (
    <>
      <DeleteActivitiesTakenButton
        eventId={eventId}
        cEventUserId={cEventUserId}
        setIsDeleted={setIsDeleted}
        setActivitiesAttendee={setActivitiesAttendee}
      />
      <List
        size='small'
        header={<h2>LECCIONES DEL CURSO</h2>}
        bordered
        dataSource={truncatedAgendaList}
        renderItem={(item: TruncatedAgenda) => (
          <item.RibbonComponent>
            <List.Item className='shadow-box'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Link to={item.link}>
                  <div>
                    {/* <ReadFilled className='list-icon' style={{marginRight: '1em'}} /> */}
                    <ActivityCustomIcon type={item.type!} className='list-icon' style={{ marginRight: '1em' }} />
                    <span>{item.title}</span>
                  </div>
                </Link>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <span style={{ marginRight: '.5em' }}>
                    {item.Component && <item.Component isDeleted={isDeleted} setIsDeleted={setIsDeleted} />}
                    {item.Component2 && currentUser.value?._id && <item.Component2 userId={currentUser.value._id} />}
                    {item.DeleteSurveyAnswersButton && currentUser.value?._id && (
                      <item.DeleteSurveyAnswersButton userId={currentUser.value._id} />
                    )}
                  </span>
                  <Link to={item.link}>
                    <span
                      style={{
                        fontWeight: '100',
                        fontSize: '1.2rem',
                      }}
                    >
                      {item.timeString}
                    </span>
                  </Link>
                </div>
              </div>
            </List.Item>
          </item.RibbonComponent>
        )}
      />
    </>
  );
};

export default ActivitiesList;
