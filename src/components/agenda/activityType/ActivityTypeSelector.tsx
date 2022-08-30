import * as React from 'react';
import { useState, useEffect } from 'react';

import { Button, Alert, Spin, Row, Col } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
// import InitialSVG from './components/svg/InitialSVG';

import ActivityTypeModal from './ActivityTypeModal';
import useActivityType from '@context/activityType/hooks/useActivityType';
import type { ActivityType } from '@context/activityType/types/activityType';

export interface SubActivityTypeSelectorProps {};

function ActivityTypeSelector(props: SubActivityTypeSelectorProps) {
  const [isModalShown, setIsModalShown] = useState(false);

  const [selected, setSelected] = useState<ActivityType.Name | null>(null);
  const [confirmedSelection, setConfirmedSelection] = useState<ActivityType.Name | null>(null);

  const {
    is,
    saveActivityType,
    deleteActivityType,
    activityType,
    setActivityType,
    humanizeActivityType,
  } = useActivityType();

  const handleCloseModal = (success: boolean = false) => {
    setIsModalShown(false);
    console.log('this stuff was closed, success:', success)
  }

  const handleSetActivityType = () => {
    setIsModalShown(true);
  };

  const handleSelectionChange = (selected: ActivityType.Name) => {
    console.log('[activity type modal] selected changes:', selected);
    setSelected(selected);
  };

  useEffect(() => {
    if (selected) {
      setActivityType(selected);
      setConfirmedSelection(selected);
    };
  }, [selected]);

  useEffect(() => {
    if (confirmedSelection) saveActivityType();
  }, [confirmedSelection]);

  if (is.updatingActivityType) return <Spin/>

  return (
    <>
    <ActivityTypeModal
      visible={isModalShown}
      onClose={handleCloseModal}
      onSelectionChange={handleSelectionChange}
    />

    {activityType !== null ? (
      <Alert
        // closable
        type='info'
        showIcon={is.deleting}
        icon={<Spin/>}
        message={`Actividad de tipo: ${humanizeActivityType(activityType)}`}
        // onClose={deleteActivityType}
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

export default ActivityTypeSelector;
