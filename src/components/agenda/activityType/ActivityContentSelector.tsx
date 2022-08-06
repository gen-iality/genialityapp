import * as React from 'react';
import { useState, useEffect } from 'react';

import { Card, Button, Alert, Row, Col } from 'antd';

import InitialSVG from '../typeActivity/components/svg/InitialSVG';

import type { ActivityType } from '@/context/activityType/types/activityType';
import ActivityContentManager from './ActivityContentManager';
import ActivityContentModal from './ActivityContentModal';

import useActivityType from '@/context/activityType/hooks/useActivityType';

export interface SubActivityContentSelectorProps {
  activityId: string,
  eventId: string,
  activityName: string,
  shouldLoad: boolean,
  matchUrl: string,
};

function ActivityContentSelector(props: SubActivityContentSelectorProps) {
  const {
    activityName,
    shouldLoad,
    matchUrl,
  } = props;

  const [modalTitle, setModalTitle] = useState('Contenido');
  const [isModalShown, setIsModalShown] = useState(false);
  const [selectedType, setSelectedType] = useState<ActivityType.GeneralTypeValue | undefined>(undefined);
  const [currentWidget, setCurrentWidget] = useState<ActivityType.CardUI | ActivityType.FormUI | undefined>(undefined);

  const {
    activityType,
    activityContentType,
    setContentSource,
    saveActivityContent,
    setActivityContentType,
    convertTypeToHumanizedString,
    getOpenedWidget,
  } = useActivityType();

  useEffect(() => {
    if (!shouldLoad) return;
    if (!activityType) {
      console.warn('activityType is none, cannot prepare content type');
      return;
    }

    const [title, widget] = getOpenedWidget(activityType);
    if (title) setModalTitle(title);
    if (widget) setCurrentWidget(widget);
  }, [shouldLoad, activityType]);

  useEffect(() => {
    if (selectedType !== undefined) {
      console.debug('we can work with', selectedType);
      handleConfirm();
    }
  }, [selectedType]);

  const handleCloseModal = (success: boolean = false) => setIsModalShown(false);

  const handleConfirm = () => {
    console.debug('confirm the selectedType:', selectedType);
    // setActivityContentType(selectedType || null);
    saveActivityContent(selectedType as ActivityType.ContentValue);
  }

  const handleInput = (text: string) => {
    console.debug('text will:', text);
    setContentSource(text);
  };

  if (!activityType) {
    return <Alert message='Primero asigne un tipo de actividad' type='error' />
  }

  if (activityContentType) {
    return (
        <>
        {/* <p>Contenido: {activityContentType}</p>
        <Button danger onClick={() => setActivityContentType(null)}>
          Eliminar contenido
        </Button> */}
        <ActivityContentManager activityName={activityName} matchUrl={props.matchUrl} />
      </>
    );
  }

  return (
    <>
    {currentWidget === undefined && (
      <Alert type='error' message='No puede cargar el tipo de actividad' />
    )}
    {currentWidget !== undefined && (
    <ActivityContentModal
      initialWidgetKey={activityContentType as ActivityType.DeepUIKey}
      visible={isModalShown}
      title={modalTitle}
      widget={currentWidget}
      activityName={props.activityName}
      onClose={handleCloseModal}
      onSelecWidgetKey={setSelectedType}
      onInput={handleInput}
    />
    )}
    <Card>
      <Row align='middle' style={{textAlign: 'center'}}>
        <Col span={24} style={{marginBottom: '1em'}}>
          <h2>
            Todavía no has agregado el contenido a la actividad
            {activityType && ` de "${convertTypeToHumanizedString(activityType)}"`}
          </h2>
        </Col>
        <Col span={24} style={{marginBottom: '1em'}}>
          <Button onClick={() => setIsModalShown(true)} type='primary'>
            Agregar contenido
          </Button>
        </Col>
        <Col span={24} style={{marginBottom: '1em'}}>
          <InitialSVG style={{ width: '255px', height: '277px' }} />
        </Col>
      </Row>
    </Card>
    </>
  );
}

export default ActivityContentSelector;
