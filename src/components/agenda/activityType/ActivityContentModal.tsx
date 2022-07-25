import * as React from 'react';
import { useMemo, useState } from 'react';
import { Alert, Modal } from 'antd';

import ActivityTypeSelectableCards from './components/ActivityTypeSelectableCards';
// import { ActivityTypeSelectableCardsProps } from './components/ActivityTypeSelectableCards';

import ActivityContentModalLayout from './components/ActivityContentModalLayout';

import { ModalWrapperUIProps} from './interfaces/ModalWrapperUIProps';
import {
  ActivitySubTypeValueType,
  FormStructure,
  ActivityTypeCard,
  ActivitySubTypeNameType,
  WidgetType,
  FormType,
  GeneralTypeValue,
} from  '@/context/activityType/schema/structureInterfaces';
import {
  activityTypeKeys,
  activitySubTypeKeys,
} from  '@/context/activityType/schema/activityTypeFormStructure';
import FullActivityTypeInfoLayout from './components/FullActivityTypeInfoLayout';
import { FullActivityTypeInfoLayoutProps } from './components/FullActivityTypeInfoLayout';

import ActivityVideoUploadField from './components/ActivityVideoUploadField';
import ActivityExternalUrlField from './components/ActivityExternalUrlField';

export interface ActivityContentModalProps extends ModalWrapperUIProps {
  widget: ActivityTypeCard | FormStructure,
  onSelecType: (selected: GeneralTypeValue) => void,
  //
  activityName: string,
  visible: boolean,
  initialType: ActivitySubTypeNameType,
  onInput?: (input: string) => void,
};

function ActivityContentModal(props: ActivityContentModalProps) {
  const {
    activityName,
    visible,
    initialType,
    onInput = () => {},
    // Inherent selectable
    widget,
    onSelecType,
    // Inherent UI
    title,
    onClose = () => {},
    // onConfirm = () => {},
  } = props;

  // const [widget, setWidget] = useState(initialWidget);
  const [selected, setSelected] = useState<GeneralTypeValue | null>(null);
  // console.log('widget ~ widget', widget)

  const handleCancel = () => onClose();

  const handleConfirm = () => {
    if (selected) {
      onSelecType(selected);
      onClose(true);
    } else {
      alert('No puede guardar dato vacío');
    }
  }

  const handleSelectChange = (newSelected: GeneralTypeValue) => {
    console.log('selected changed to', newSelected);
    setSelected(newSelected);
  }

  const somethingWasSelected = useMemo(() => selected !== null, [selected]);

  return (
    <Modal
      centered
      width={1200}
      footer={null}
      visible={visible}
      onCancel={handleCancel}
    >
      <ActivityContentModalLayout
        somethingWasSelected={somethingWasSelected}
        initialType={initialType}
        title={title}
        selected={selected} // To know what is selected
        onSelectChange={handleSelectChange} // To update selected
        widget={widget} // To render from that
        onClose={onClose}
        onConfirm={handleConfirm}
        render={(type: string | undefined, data: ActivityTypeCard | FormStructure) => {
          // console.debug(`render(${type}, ${JSON.stringify(data)})`);
          if ('widgetType' in data) {
            const card: ActivityTypeCard = data;
            switch (card.widgetType) {
              case WidgetType.FORM:
                return <Alert message='Si esto se ve, se está pasando un card (que tiene un hijo form) en lugar de pasar el form...' />
              case WidgetType.CARD_SET:
                return <ActivityTypeSelectableCards
                  selected={selected}
                  widget={card}
                  onWidgetChange={(w) => handleSelectChange(w.key)}
                />
              case WidgetType.FINAL:
                return <Alert type='info' message='El fin' />
              default:
                return (
                  <Alert
                    message={`Tipo de widget ${(card as ActivityTypeCard).widgetType} es desconocido`}
                    type='error'
                  />
                );
            }
          }

          if ('formType' in data) {
            const form: FormStructure = data;
            switch (form.formType) {
              case FormType.INFO:
                return <FullActivityTypeInfoLayout
                  form={form}
                  onLoaded={() => {
                    handleSelectChange(form.key)
                  }}
                />
              case FormType.INPUT:
                return <ActivityExternalUrlField
                  onInput={onInput}
                  type={form.key}
                  iconSrc={form.image}
                  subtitle={form.title}
                  placeholder={form.placeholder}
                  addonBefore={form.addonBefore}
                />
              case FormType.UPLOAD:
                return <ActivityVideoUploadField
                  activityName={activityName}
                />
            }
          }

          return (
            <Alert
              type='error'
              message={`No puede interpretar ${JSON.stringify(data)}`}
            />
          );
        }}
      />
    </Modal>
  );
}

export default ActivityContentModal;
