import { List, ListProps } from 'antd';
import { Certificates } from '@/components/agenda/types';
import { isMobile } from 'react-device-detect';
import { CertificateItemList } from './CertificateItemList';

interface Props extends ListProps<Certificates> {
  eventsWithEventUser: any[];
  eventUsers: any[];
}

const CertificatesByEventsAndUserList = ({ grid, eventsWithEventUser, eventUsers, ...listProps }: Props) => {
  return (
    <List
      style={{ backgroundColor: 'red' }}
      renderItem={(certificate) => (
        <CertificateItemList
          key={'certi' + certificate._id}
          certificate={certificate}
          eventUserValue={eventUsers.find((eventUser) => eventUser.event_id === certificate.event_id)}
          eventValue={eventsWithEventUser.find((event) => event._id === certificate.event_id)}
          isMobile={isMobile}
        />
      )}
      {...listProps}
    />
  );
};

export default CertificatesByEventsAndUserList;
