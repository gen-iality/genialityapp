import { List } from 'antd';
import React from 'react';
import useGetSpacesMeetingsByUser from '../../hooks/useGetSpaceMeetingByUser';
import { Moment } from 'moment';
import { shortName } from '../../utils/utils';

interface ListSpacesAvalibleProps {
  date: Moment;
  targetUserName: string;
}

const SpacesAvalibleList = ({ date, targetUserName }: ListSpacesAvalibleProps) => {
  const { spacesMeetings, spaceMeetingLoading } = useGetSpacesMeetingsByUser(date);
  return (
    <>
      <List loading={spaceMeetingLoading}>
        {spacesMeetings !== 'initial' &&
          spacesMeetings?.map((spaceMeeting) => (
            <List.Item>
              Reunion con {shortName(targetUserName)} a las <strong>{spaceMeeting.hourStart}</strong>
            </List.Item>
          ))}
      </List>
    </>
  );
};

export default SpacesAvalibleList;
