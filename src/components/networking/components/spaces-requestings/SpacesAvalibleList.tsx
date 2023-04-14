import { Button, Col, List, Row, Typography } from 'antd';
import React from 'react';
import useGetSpacesMeetingsByUser from '../../hooks/useGetSpaceMeetingByUser';
import moment, { Moment } from 'moment';
import { shortName } from '../../utils/utils';
import { StatusSpace } from '../../interfaces/space-requesting.interface';
import firebase from 'firebase/compat';

interface ListSpacesAvalibleProps {
  date: Moment;
  targetUserName: string;
  targetEventUserId: string;
  onSubmit: (startDate: firebase.firestore.Timestamp, endDate: firebase.firestore.Timestamp) => Promise<void>;
}

const SpacesAvalibleList = ({ date, targetUserName, targetEventUserId, onSubmit }: ListSpacesAvalibleProps) => {
  const { spacesMeetingsToTargedUser, spacesMeetingsToTargedUserLoading } = useGetSpacesMeetingsByUser(
    date,
    targetEventUserId
  );
  const getAccionButton = (status: StatusSpace) => {
    if (status === 'avalible') return 'Agendar';
    if (status === 'not_available') return 'No disponible';
    if (status === 'requested') return 'Solicitado';
  };

  const getDisabledAccionButton = (status: StatusSpace) => {
    if (status === 'not_available' || status === 'requested') return true;
    return false;
  };

  return (
    <>
      <List loading={spacesMeetingsToTargedUserLoading}>
        {spacesMeetingsToTargedUser?.map((spaceMeeting) => (
          <List.Item>
            <Row gutter={20}>
              <Col>
                <Typography>
                  Reunion entre {moment(spaceMeeting.dateStart.toDate()).format('h:mm a')} y las{' '}
                  {moment(spaceMeeting.dateEnd.toDate()).format('h:mm a')}
                </Typography>
              </Col>
              <Col>
                <Button
                  disabled={getDisabledAccionButton(spaceMeeting.status)}
                  onClick={() => onSubmit(spaceMeeting.dateStart, spaceMeeting.dateEnd)}>
                  {getAccionButton(spaceMeeting.status)}
                </Button>
              </Col>
            </Row>
          </List.Item>
        ))}
      </List>
    </>
  );
};

export default SpacesAvalibleList;
