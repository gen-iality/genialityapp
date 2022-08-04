import * as React from 'react';
import { useState, useEffect } from 'react';

import { Card, Result, Button, Alert, Row, Col, Space } from 'antd';

import InitialSVG from '../typeActivity/components/svg/InitialSVG';

import {
  activitySubTypeKeys,
  activityTypeKeys,
} from '@/context/activityType/schema/activityTypeFormStructure';
import {
  ActivityTypeCard,
  FormStructure,
  WidgetType,
  ActivitySubTypeKey,
  GeneralTypeName,
  GeneralTypeValue,
  ActivitySubTypeName,
} from '@/context/activityType/schema/structureInterfaces';
import ActivityContentManager from './ActivityContentManager';
import ActivityContentModal from './ActivityContentModal';

import useActivityType from '@/context/activityType/hooks/useActivityType';

export interface SubActivityContentSelectorProps {
  activityId: string,
  eventId: string,
  activityName: string,
  shouldLoad: boolean,
};

function SubActivityContentSelector(props: SubActivityContentSelectorProps) {
  const {
    activityId,
    eventId,
    activityName,
    shouldLoad
  } = props;

  const [modalTitle, setModalTitle] = useState('Contenido');
  const [isModalShown, setIsModalShown] = useState(false);
  const [selectedType, setSelectedType] = useState<GeneralTypeValue | undefined>(undefined);
  const [currentWidget, setCurrentWidget] = useState<ActivityTypeCard | FormStructure | undefined>(undefined);

  const {
    activityType,
    activityContentType,
    formWidgetFlow,
    contentSource,
    setContentSource,
    saveActivityContent,
    setActivityContentType,
  } = useActivityType();

  useEffect(() => {
    if (!shouldLoad) return;
    if (!activityType) {
      console.warn('activityType is none, cannot prepare content type');
      return;
    }

    let index;
    switch (activityType) {
      case activityTypeKeys.live:
        index = 0;
        break;
      case activityTypeKeys.meeting:
        index = 1;
        break;
      case activityTypeKeys.video:
        index = 2;
        break;
      case activityTypeKeys.quizing:
        index = 3;
        break;
      case activityTypeKeys.survey:
        index = 4;
        break;
      default:
        console.error(`No puede reconocer actividad de tipo "${activityType}"`);
        break;
    }

    if (index !== undefined) {
      // Set the title, and the data to the views
      const currentOpenedCard: ActivityTypeCard = formWidgetFlow.cards[index];
      console.debug('opened widget is:', currentOpenedCard);
      setModalTitle(currentOpenedCard.MainTitle);

      if (currentOpenedCard.widgetType === WidgetType.FORM) {
        console.debug('Pass the form widget')
        setCurrentWidget(currentOpenedCard.form);
      } else {
        console.debug('Whole widget was passed');
        setCurrentWidget(currentOpenedCard);
      }
    } else {
      console.error('Tries to understand', activityType, ' but I think weird stuffs..');
    }
  }, [shouldLoad, activityType]);

  useEffect(() => {
    if (selectedType !== undefined) {
      console.debug('we can work with', selectedType);
      handleConfirm();
    }
  }, [selectedType]);

  const handleCloseModal = (success: boolean = false) => {
    setIsModalShown(false);
  };

  const handleConfirm = () => {
    console.debug('confirm the selectedType:', selectedType);
    // setActivityContentType(selectedType || null);
    saveActivityContent(selectedType as ActivitySubTypeName);
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
        <Button
          danger
          onClick={() => setActivityContentType(null)}
        >
          Eliminar contenido
        </Button> */}
        <ActivityContentManager activityName={activityName}/>
      </>
    );
  }

  return (
    <>
    {currentWidget === undefined && (
      <Alert
        type='error'
        message='No puede cargar el tipo de actividad'
      />
    )}
    {currentWidget !== undefined && (
    <ActivityContentModal
      initialWidgetKey={activityContentType as ActivitySubTypeKey}
      visible={isModalShown}
      title={modalTitle}
      widget={currentWidget}
      activityName={props.activityName}
      onClose={handleCloseModal}
      onSelecWidgetKey={setSelectedType}
      onInput={handleInput}
      // onConfirm={handleConfirm}
    />
    )}
    <Card>
      <Row align='middle' style={{textAlign: 'center'}}>
        <Col span={24} style={{marginBottom: '1em'}}>
          <h2>Todavía no has agregado el contenido a la actividad</h2>
        </Col>
        <Col span={24} style={{marginBottom: '1em'}}>
          <Button onClick={() => setIsModalShown(true)} type='primary'>
            Agregar contenido
            {activityType && `: ${activityType}`}
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

export default SubActivityContentSelector;
