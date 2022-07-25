import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';

import { Modal } from 'antd';

import ActivityTypeSelectableCards from './components/ActivityTypeSelectableCards';
import ActivityTypeModalLayout from './components/ActivityTypeModalLayout';
import { ActivityTypeValueType } from '@/context/activityType/schema/structureInterfaces';
import useActivityType from '@/context/activityType/hooks/useActivityType';
// import { ActivityTypeCard } from '@/context/activityType/schema/structureInterfaces';

export interface ActivityTypeModalProps {
  visible: boolean,
  onClose: (success?: boolean) => void,
  onSelectionChange: (selected: ActivityTypeValueType) => void,
};

function ActivityTypeModal(props: ActivityTypeModalProps) {
  const [selected, setSelected] = useState<ActivityTypeValueType | null>(null);

  const { formWidgetFlow } = useActivityType();
  
  const handleCancel = () => {
    props.onClose(false)
    setSelected(null); // Reset the selected item
  };

  const somethingWasSelected = useMemo(() => selected !== null, [selected]);

  const handleConfirm = () => {
    console.log('activity type saved:', selected);
    if (somethingWasSelected && selected) {
      props.onSelectionChange(selected);
    }
  }

  const handleSelectChange = (newSelected: ActivityTypeValueType) => {
    console.log('selected changed to', newSelected);
    setSelected(newSelected);
  }

  useEffect(() => {
    if (!props.visible) {
      setSelected(null);
    }
  }, [props.visible]);

  return (
    <Modal
      centered
      width={1200}
      footer={null}
      visible={props.visible}
      onCancel={handleCancel}
    >
      <ActivityTypeModalLayout
        somethingWasSelected={somethingWasSelected}
        title={formWidgetFlow.MainTitle}
        onClose={props.onClose}
        onConfirm={handleConfirm}
        render={() => <ActivityTypeSelectableCards
          selected={selected}
          widget={formWidgetFlow}
          onWidgetChange={(widget) => {
            // In this case, the keys are the same of the activity type value
            handleSelectChange(widget.key as ActivityTypeValueType);
          }}
        />}
      />
    </Modal>
  );
}

export default ActivityTypeModal;
