import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';

import { Modal } from 'antd';

import ActivityTypeSelectableCards from './components/ActivityTypeSelectableCards';
import ActivityTypeModalLayout from './components/ActivityTypeModalLayout';
import { ActivityTypeValueType } from '@/context/activityType/schema/structureInterfaces';

export interface ActivityTypeModalProps {
  visible: boolean,
  onClose: (success?: boolean) => void,
  onSelectionChange: (selected: string | null) => void,
};

function ActivityTypeModal(props: ActivityTypeModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  
  const handleCancel = () => {
    props.onClose(false)
    setSelected(null); // Reset the selected item
  };

  const somethingWasSelected = useMemo(() => selected !== null, [selected]);

  const handleConfirm = () => {
    console.log('activity type saved:', selected);
    if (somethingWasSelected) {
      props.onSelectionChange(selected);
      // setSelected(null);
    }
  }

  const handleSelectChange = (newSelected: string) => {
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
        title={activityTypeData.MainTitle}
        onClose={props.onClose}
        onConfirm={handleConfirm}
        render={() => <ActivityTypeSelectableCards
          selected={selected}
          widget={activityTypeData}
          onWidgetChange={(widget) => {
            handleSelectChange(widget.key);
          }}
        />}
      />
    </Modal>
  );
}

export default ActivityTypeModal;
