import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';

import { Modal } from 'antd';

import ActivityTypeSelectableCards from './components/ActivityTypeSelectableCards';
import ActivityTypeModalLayout from './components/ActivityTypeModalLayout';
import type { ActivityType } from '@context/activityType/types/activityType';
import useActivityType from '@context/activityType/hooks/useActivityType';

export interface ActivityTypeModalProps {
  visible: boolean,
  onClose: (success?: boolean) => void,
  onSelectionChange: (selected: ActivityType.Name) => void,
};

function ActivityTypeModal(props: ActivityTypeModalProps) {
  const [selected, setSelected] = useState<ActivityType.Name | null>(null);

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

  const handleSelectChange = (newSelected: ActivityType.Name) => {
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
            handleSelectChange(widget.key as ActivityType.Name);
          }}
        />}
      />
    </Modal>
  );
}

export default ActivityTypeModal;
