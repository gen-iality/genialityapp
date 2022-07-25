import * as React from 'react';
import { useState, useEffect } from 'react';

import { Card, Result, Button, Alert, Spin, Row, Col } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
// import InitialSVG from './components/svg/InitialSVG';

import { TypesAgendaApi, AgendaApi } from '@/helpers/request';
import ActivityTypeModal from './ActivityTypeModal';
import { ExtendedAgendaDocumentType } from '../types/AgendaDocumentType';

export interface SubActivityTypeSelectorProps {
  activityId: string,
  eventId: string,
  activityName: string,
};

function SubActivityTypeSelector(props: SubActivityTypeSelectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingActivityType, setIsDeletingActivityType] = useState(false);
  const [temporalErrorMessage, setTemporalErrorMessage] = useState('');
  const [isModalShown, setIsModalShown] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleCloseModal = (success: boolean = false) => {
    setIsModalShown(false);

    console.log('this stuff was closed, success:', success)
    
    // if (success) saveActivityType(); - glitched
  }

  const handleSetActivityType = () => {
    setIsModalShown(true);
  };

  const handleSelectionChange = (selected: string | null) => {
    console.log('[activity type modal] selected changes:', selected);
    setSelected(selected);
    saveActivityType(selected); // because glitched
  };

  const saveActivityType = (selected: string | null /* because glitched */) => {
    console.log('selected in wrapped is:', selected)
    if (selected === null) {
      // alert('No se puedo guardar bien');
      return;
    };
    (async () => {
      const createTypeActivityBody = { name: selected };
      const activityType = await TypesAgendaApi
        .create(props.eventId, createTypeActivityBody);
      const agenda = await AgendaApi
        .editOne({ type_id: activityType._id }, props.activityId, props.eventId);
      console.log('agenda: activity type changes:', agenda);
    })();
  };

  const deleteActivityType = async () => {
    console.log('Reset the activity type')
    setIsDeletingActivityType(true);
    // Can this delete the activity type? well, in the future we will know about
    try {
      await TypesAgendaApi.deleteOne(props.activityId, props.eventId);
    } catch (err) {
      setTemporalErrorMessage(` (no puede: ${err})`);
      setTimeout(() => setTemporalErrorMessage(''), 3000);
    } finally {
      setSelected(null);
      setIsDeletingActivityType(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const agendaInfo: ExtendedAgendaDocumentType = await AgendaApi
          .getOne(props.activityId, props.eventId);
        // setDefinedType(agendaInfo.type?.name || null);
        const typeIncomming = agendaInfo.type?.name;
        if (typeIncomming) setSelected(typeIncomming);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <Spin/>
  }

  return (
    <>
    <ActivityTypeModal
      visible={isModalShown}
      onClose={handleCloseModal}
      onSelectionChange={handleSelectionChange}
    />

    {selected !== null ? (
      <Alert
        closable
        type='info'
        showIcon={isDeletingActivityType}
        icon={<Spin/>}
        message={`Actividad de tipo: ${selected} ${temporalErrorMessage}`}
        onClose={deleteActivityType}
      />
    ) : (
    <Row>
      <Col span={2}>
        <WarningOutlined width={'auto'} />
      </Col>
      <Col span={14}>
        <p>Todavía no has definido el tipo de actividad</p>
      </Col>
      <Col span={8}>
        <Button onClick={handleSetActivityType} type='primary'>
          Escoge un tipo de actividad
        </Button>
      </Col>
    </Row>
    )}
    </>
  );
}

export default SubActivityTypeSelector;
