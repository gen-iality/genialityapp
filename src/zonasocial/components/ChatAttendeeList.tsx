import { useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { List } from 'antd';
import UsersCard from '@/components/shared/usersCard';
import { IAttendeeParsed } from '..';

interface Props {
  attendeeListFiltered: IAttendeeParsed[];
}

const PAGE_SIZE = 10;
export const ChatAttendeeList = ({ attendeeListFiltered }: Props) => {
  const [currentScroll, setCurrentScroll] = useState(1);

  const numberAttendee = attendeeListFiltered.length;

  const numberAttendeeScroll = useMemo(() => currentScroll * PAGE_SIZE, [currentScroll]);

  const hasMore = useMemo(() => numberAttendeeScroll < numberAttendee - 1, [numberAttendeeScroll, numberAttendee]);

  const handleInfiniteOnLoad = (newPage: any) => {
    setCurrentScroll(newPage);
  };

  return (
    <InfiniteScroll
      initialLoad={false}
      pageStart={1}
      loadMore={handleInfiniteOnLoad}
      hasMore={hasMore}
      useWindow={false}>
      <List
        itemLayout='horizontal'
        dataSource={attendeeListFiltered.slice(0, numberAttendeeScroll)}
        renderItem={(item, key) => (
          <UsersCard key={key} llave={key} item={item} propsAttendees={item.properties} type={'attendees'} />
        )}></List>
    </InfiniteScroll>
  );
};
