import { Divider, List, Typography, Button, Spin, Badge } from 'antd';
import { DesktopOutlined, FileDoneOutlined, ReadFilled, VideoCameraOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AgendaApi } from '@/helpers/request';
import dayjs from 'dayjs';
import { ExtendedAgendaType } from '@/Utilities/types/AgendaType';
import { activityContentValues } from '@/context/activityType/constants/ui';
import { ActivityType } from '@/context/activityType/types/activityType';
import { firestore } from '@/helpers/firebase';
import LessonViewedCheck from '../LessonViewedCheck';

const data = [
  <div>
    <ReadFilled className='list-icon' />
    <span>Racing car sprays burning fuel into crowd.</span>
  </div>,
  'JAPANESE PRICESS MARRIED WITH COMMOONER',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

type TruncatedAgenda = {
  title: string,
  type?: ActivityType.ContentValue,
  timeString: string,
  link: string,
  Component?: any,
};

interface ActivitiesListProps {
  eventId: string,
  cEventUserId: string,
};

interface CustomIconProps {
  type: ActivityType.ContentValue,
  [x: string]: any,
};

const CustomIcon = ({type, ...props} : CustomIconProps) => {
  switch (type) {
    case activityContentValues.file:
    case activityContentValues.url:
      return <VideoCameraOutlined {...props} />
    case activityContentValues.meet:
    case activityContentValues.meeting:
    case activityContentValues.rtmp:
    case activityContentValues.youtube:
    case activityContentValues.vimeo:
    case activityContentValues.streaming:
      return <DesktopOutlined {...props}/>
    case activityContentValues.quizing:
    case activityContentValues.survey:
      return <FileDoneOutlined {...props}/>
    default: return <ReadFilled {...props}/>;
  }
};

const ActivitiesList = (props: ActivitiesListProps) => {
  const {
    eventId, // The event ID
    cEventUserId, // The event user ID
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [truncatedAgendaList, setTruncatedAgendaList] = useState<TruncatedAgenda[]>([]);

  useEffect(() => {
    if (!eventId) return;
    if (!cEventUserId) return;

    (async () => {
      setIsLoading(true);
      setTruncatedAgendaList([]);
      const { data: agendaList } = await AgendaApi.byEvent(eventId) as { data: ExtendedAgendaType[]};

      setTruncatedAgendaList((previous) => ([
        ...previous,
        ...agendaList.map((agenda) => {
          // Logic here
          let diff = Math.floor(Math.random() * 60*60);

          try {
            diff = dayjs(agenda.datetime_end).diff(dayjs(agenda.datetime_start));
          } catch (err) {
            console.error(err);
          }

          const result: TruncatedAgenda = {
            title: agenda.name,
            type: agenda.type?.name as ActivityType.ContentValue,
            timeString: dayjs(diff).format('h:mm').concat(' min'),
            link: `/landing/${eventId}/activity/${agenda._id}`,
            Component: () => {
              const [isTaken, setIsTaken] = useState(false);
              useEffect(() => {
                (async () => {
                  console.log('item._id', agenda._id)
                  let activity_attendee = await firestore
                    .collection(`${agenda._id}_event_attendees`)
                    .doc(cEventUserId)
                    .get(); //checkedin_at
                  if (activity_attendee && activity_attendee.exists) {
                    // If this activity existes, then it means the lesson was taken
                    setIsTaken(activity_attendee.data()?.checked_in);
                  }
                })();
              }, []);
              if (isTaken) return <Badge count='Visto'/>
              return <></>;
            }
          };
          return result;
        })
      ]))

      setIsLoading(false);
    })();
  }, [eventId, cEventUserId]);

  if (isLoading) return <Spin/>

  return (
    <List
      size='small'
      header={<h2>LECCIONES DEL CURSO</h2>}
      bordered
      dataSource={truncatedAgendaList}
      renderItem={(item: TruncatedAgenda) => (
        <List.Item className='shadow-box'>
          <Link
            to={item.link}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div>
              {/* <ReadFilled className='list-icon' style={{marginRight: '1em'}} /> */}
              <CustomIcon type={item.type!} className='list-icon' style={{marginRight: '1em'}} />
              <span>{item.title}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
              <span style={{marginRight: '.5em',}}>
                <item.Component/>
              </span>
              <span
                style={{
                  fontWeight: '100',
                  fontSize: '1.2rem',
                }}
              >{item.timeString}</span>
            </div>
          </Link>
        </List.Item>
      )}
    />
  );
};
export default ActivitiesList;
