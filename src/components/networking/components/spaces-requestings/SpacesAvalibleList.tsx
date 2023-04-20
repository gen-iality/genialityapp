import { Button, Col, List, Result, Row, Typography } from 'antd';
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
  creatorEventUserId: string;
  loadingButton: boolean;
}

const SpacesAvalibleList = ({
  date,
  targetUserName,
  targetEventUserId,
  onSubmit,
  creatorEventUserId,
  loadingButton,
}: ListSpacesAvalibleProps) => {
  const { spacesMeetingsToTargedUser, spacesMeetingsToTargedUserLoading } = useGetSpacesMeetingsByUser(
    date,
    targetEventUserId,
    creatorEventUserId
  );
  const getAccionButton = (status: StatusSpace) => {
    if (status === 'avalible') return 'Agendar';
    if (status === 'not_available') return 'No disponible';
    if (status === 'requested') return 'Solicitado';
    if (status === 'rejected') return 'Rechazado';
    if (status === 'accepted') return 'Aceptado';
    if (status === 'canceled') return 'Cancelado';
    if (status === 'have-meeting') return 'Agenda Ocupada';
  };

  const getDisabledAccionButton = (status: StatusSpace) => {
    if (
      status === 'not_available' ||
      status === 'requested' ||
      status === 'rejected' ||
      status === 'accepted' ||
      status === 'canceled' ||
      status === 'have-meeting'
    )
      return true;
    return false;
  };

  if (!spacesMeetingsToTargedUserLoading && spacesMeetingsToTargedUser.length === 0)
    return <Result title='Debe configurar los parametros del networking' />;
  return (
    <>
      <List loading={spacesMeetingsToTargedUserLoading || loadingButton}>
        {!spacesMeetingsToTargedUserLoading &&
          spacesMeetingsToTargedUser?.map((spaceMeeting, index) => (
            <List.Item
              key={index}
              extra={
                <Button
                  disabled={getDisabledAccionButton(spaceMeeting.status)}
                  onClick={() => onSubmit(spaceMeeting.dateStart, spaceMeeting.dateEnd)}>
                  {getAccionButton(spaceMeeting.status)}
                </Button>
              }>
              <List.Item.Meta
                title={
                  <Typography.Paragraph>
                    Reunion entre {moment(spaceMeeting.dateStart.toDate()).format('h:mm a')} y las{' '}
                    {moment(spaceMeeting.dateEnd.toDate()).format('h:mm a')}
                  </Typography.Paragraph>
                }
              />
            </List.Item>
          ))}
      </List>
    </>
  );
};

export default SpacesAvalibleList;
