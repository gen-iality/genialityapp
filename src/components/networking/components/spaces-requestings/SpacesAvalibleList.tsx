import { Button, Col, Form, List, Result, Row, Typography } from 'antd';
import React, { useState } from 'react';
import useGetSpacesMeetingsByUser from '../../hooks/useGetSpaceMeetingByUser';
import moment, { Moment } from 'moment';
import firebase from 'firebase/compat';
import TextArea from 'antd/lib/input/TextArea';
import { getAccionButton, getDisabledAccionButton } from './utils/space-avalible-list.utils';
import { IFormRequestSpace } from './interfaces/space-avalible.interfaces';

interface ListSpacesAvalibleProps {
  date: Moment;
  targetUserName: string;
  targetEventUserId: string;
  onSubmit: (
    message: string,
    startDate: firebase.firestore.Timestamp,
    endDate: firebase.firestore.Timestamp
  ) => Promise<void>;
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
  const [clickedIndices, setClickedIndices] = useState<number>(-1);
  const { spacesMeetingsToTargedUser, spacesMeetingsToTargedUserLoading } = useGetSpacesMeetingsByUser(
    date,
    targetEventUserId,
    creatorEventUserId
  );

  const onAgendar = (index: number) => {
    setClickedIndices(index);
  };
  const onCancelar = (index: number) => {
    setClickedIndices(-1);
  };
  const onHandledSubmit = (
    values: IFormRequestSpace,
    dateStart: firebase.firestore.Timestamp,
    dateEnd: firebase.firestore.Timestamp
  ) => {
    onSubmit(values.message, dateStart, dateEnd);
  };
  if (!spacesMeetingsToTargedUserLoading && spacesMeetingsToTargedUser.length === 0)
    return <Result title='Debe configurar los parametros del networking' />;
  return (
    <>
      <List loading={spacesMeetingsToTargedUserLoading || loadingButton}>
        {!spacesMeetingsToTargedUserLoading &&
          spacesMeetingsToTargedUser?.map((spaceMeeting, index) => (
            <List.Item
              key={spaceMeeting.dateStart.seconds}
              extra={
                <>
                  {clickedIndices !== index && (
                    <Button disabled={getDisabledAccionButton(spaceMeeting.status)} onClick={() => onAgendar(index)}>
                      {getAccionButton(spaceMeeting.status)}
                    </Button>
                  )}
                </>
              }>
              <List.Item.Meta
                title={
                  <>
                    <Typography.Paragraph>
                      Reunion entre {moment(spaceMeeting.dateStart.toDate()).format('h:mm a')} y las{' '}
                      {moment(spaceMeeting.dateEnd.toDate()).format('h:mm a')}
                    </Typography.Paragraph>
                    {clickedIndices === index && (
                      <>
                        <Form
                          autoComplete='off'
                          ref={() => {}}
                          onFinish={(values) => onHandledSubmit(values, spaceMeeting.dateStart, spaceMeeting.dateEnd)}>
                          <Form.Item name={'message'}>
                            <TextArea placeholder='Ingrese su mensaje aquí' />
                          </Form.Item>
                          <Row gutter={[8, 8]}>
                            <Col>
                              <Button htmlType='submit' disabled={getDisabledAccionButton(spaceMeeting.status)}>
                                {getAccionButton(spaceMeeting.status)}
                              </Button>
                            </Col>
                            <Col>
                              <Button danger onClick={() => onCancelar(index)}>
                                Cancelar
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      </>
                    )}
                  </>
                }
              />
            </List.Item>
          ))}
      </List>
    </>
  );
};

export default SpacesAvalibleList;
