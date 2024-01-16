import ThisRouteCanBeDisplayed from '@/components/events/Landing/helpers/thisRouteCanBeDisplayed';
import { Row, Space } from 'antd';
import { useListeningAttendee } from '../hooks/useListeningAttendee';
import { useSearchList } from '@/hooks/useSearchList';
import { ChatAttendeeList } from './ChatAttendeeList';

interface Props {
  eventId: string;
  colorTextMenu: string;
}
export const TabChatAttendee = ({ eventId, colorTextMenu }: Props) => {
  const { attendeeListParsed, attendeeList } = useListeningAttendee(eventId);
  const { filteredList, setSearchTerm } = useSearchList(attendeeListParsed, 'names');
  return (
    <ThisRouteCanBeDisplayed>
      <div key='AttendeList'>
        <Row>
          <Space size={10} style={{ width: '100%' }}>
            {attendeeListParsed.length === 0 ? (
              ''
            ) : (
              <div
                className='control'
                style={{
                  marginBottom: '10px',
                  marginRight: '5px',
                  color: 'white',
                  width: '100%',
                }}>
                <input
                  style={{ color: colorTextMenu }}
                  type='text'
                  name={'name'}
                  onChange={({ target: { value } }) => setSearchTerm(value)}
                  placeholder='Buscar participante...'
                />
              </div>
            )}
          </Space>
        </Row>
        <div className='asistente-list'>
          {attendeeListParsed.length === 0 ? (
            <Row justify='center'>
              <p>No hay asistentes aún</p>
            </Row>
          ) : (
            <ChatAttendeeList attendeeListFiltered={filteredList} />
          )}
        </div>
      </div>
    </ThisRouteCanBeDisplayed>
  );
};
