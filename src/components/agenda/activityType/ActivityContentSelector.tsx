import * as React from 'react';
import { useState, useEffect } from 'react';

import { Card, Button, Alert, Row, Col } from 'antd';

import InitialSVG from '../typeActivity/components/svg/InitialSVG';

import type { ActivityType } from '@context/activityType/types/activityType';
import ActivityContentManager from './ActivityContentManager';
import ActivityContentModal from './ActivityContentModal';

import useActivityType from '@context/activityType/hooks/useActivityType';
import { useGetWidgetForActivityType } from '@/context/activityType/hooks/useGetWidgetForActivityType';

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
  const [widget, setWidget] = useState<ActivityType.CardUI | ActivityType.FormUI | undefined>(undefined);

  const {
    activityType,
    activityContentType,
    setContentSource,
    saveActivityContent,
    convertTypeToHumanizedString,
  } = useActivityType();

  useEffect(() => {
    if (!shouldLoad) return;
    if (!activityType) {
      console.warn('activityType is none, cannot prepare content type');
      return;
    }

    const [title, widget] = useGetWidgetForActivityType(activityType);
    if (title) setModalTitle(title);
    if (widget) setWidget(widget);
  }, [shouldLoad, activityType]);

  useEffect(() => {
    if (selectedType !== undefined) {
      console.debug('confirm the selectedType:', selectedType);
      saveActivityContent(selectedType as ActivityType.ContentValue);
    }
  }, [selectedType]);

  const handleCloseModal = (success: boolean = false) => {
    console.debug('modal is hidden', success ? 'successfully' : 'failurely');
    setIsModalShown(false);
  };

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
        {/*
       
        <p>Contenido: {activityContentType}</p>
        <Button danger onClick={() => setActivityContentType(null)}>
          Eliminar contenido
        </Button>
        */}
        <ActivityContentManager activityName={activityName} matchUrl={props.matchUrl} />
      </>
    );
  }

  return (
    <>
    {widget === undefined && (
      <Alert type='error' message='No puede cargar el tipo de actividad' />
    )}
    {widget !== undefined && (
    <ActivityContentModal
      isVisible={isModalShown}
      title={modalTitle}
      widget={widget}
      activityName={props.activityName}
      onClose={handleCloseModal}
      onConfirmType={setSelectedType}
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
