import { List, ListProps, Space } from 'antd';
import { Certificates } from '@/components/agenda/types';
import { isMobile } from 'react-device-detect';
import { CertificateItemList } from './CertificateItemList';

interface Props extends ListProps<Certificates> {
  eventsWithEventUser: any[];
  eventUser: any;
}

const CertificatesByEventsAndUserList = ({ grid, eventsWithEventUser, eventUser, ...listProps }: Props) => {
  return (
    <List
      bordered={false}
      renderItem={(certificate) => (
        <CertificateItemList
          key={'certi' + certificate._id}
          certificate={certificate}
          eventUserValue={eventUser}
          eventValue={eventsWithEventUser.find((event) => event._id === certificate.event_id)}
          isMobile={isMobile}
        />
      )}
      {...listProps}
    />
  );
};

export default CertificatesByEventsAndUserList;
