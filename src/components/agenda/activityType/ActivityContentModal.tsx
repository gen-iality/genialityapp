import * as React from 'react';
import { useMemo, useState } from 'react';
import { Alert, Modal } from 'antd';

import ActivityTypeSelectableCards from './components/ActivityTypeSelectableCards';
// import { ActivityTypeSelectableCardsProps } from './components/ActivityTypeSelectableCards';

import ActivityContentModalLayout from './components/ActivityContentModalLayout';

import { ModalWrapperUIProps} from './interfaces/ModalWrapperUIProps';
import type { ActivityType } from  '@context/activityType/types/activityType';
import { FormType, WidgetType } from '@context/activityType/constants/enum';

import FullActivityTypeInfoLayout from './components/FullActivityTypeInfoLayout';

import ActivityVideoUploadField from './components/ActivityVideoUploadField';
import ActivityExternalUrlField from './components/ActivityExternalUrlField';

export interface ActivityContentModalProps extends ModalWrapperUIProps {
  widget: ActivityType.CardUI | ActivityType.FormUI,
  onSelecWidgetKey: (key: ActivityType.GeneralTypeValue) => void,
  //
  activityName: string,
  visible: boolean,
  initialWidgetKey: ActivityType.DeepUIKey,
  onInput?: (input: string) => void,
};

function ActivityContentModal(props: ActivityContentModalProps) {
  const {
    activityName,
    visible,
    initialWidgetKey: initialType,
    onInput = () => {},
    // Inherent selectable
    widget,
    onSelecWidgetKey,
    // Inherent UI
    title,
    onClose = () => {},
    // onConfirm = () => {},
  } = props;

  const [widgetKey, setWidgetKey] = useState<ActivityType.GeneralTypeValue | null>(null);

  const handleCancel = () => onClose();

  const handleConfirm = () => {
    if (widgetKey) {
      onSelecWidgetKey(widgetKey);
      onClose(true);
    } else {
      alert('No puede guardar dato vacío');
    }
  };

  const handleWidgetKeyChange = (newKey: ActivityType.GeneralTypeValue) => {
    console.log('selected changed to', newKey);
    setWidgetKey(newKey);
  };

  const somethingWasSelected = useMemo(() => widgetKey !== null, [widgetKey]);

  return (
    <Modal
      centered
      width={1200}
      footer={null}
      visible={visible}
      onCancel={handleCancel}
    >
      <ActivityContentModalLayout
        disabledNextButton={!somethingWasSelected}
        initialType={initialType}
        title={title}
        selected={widgetKey} // To know what is selected
        onWidgetKeyChange={handleWidgetKeyChange} // To update selected
        widget={widget} // To render from that
        onClose={onClose}
        onConfirm={handleConfirm}
        render={(widgetData: ActivityType.CardUI | ActivityType.FormUI) => {
          // console.debug(`render(${type}, ${JSON.stringify(data)})`);
          if ('widgetType' in widgetData) {
            const card: ActivityType.CardUI = widgetData;
            switch (card.widgetType) {
              case WidgetType.FORM:
                return <Alert message='Si esto se ve, se está pasando un card (que tiene un hijo form) en lugar de pasar el form...' />
              case WidgetType.CARD_SET:
                return <ActivityTypeSelectableCards
                  selected={widgetKey}
                  widget={card}
                  onWidgetChange={(w) => handleWidgetKeyChange(w.key)}
                />
              case WidgetType.FINAL:
                return <Alert type='info' message='El fin' />
              default:
                return (
                  <Alert
                    message={`Tipo de widget ${(card as ActivityType.CardUI).widgetType} es desconocido`}
                    type='error'
                  />
                );
            }
          }

          if ('formType' in widgetData) {
            const form: ActivityType.FormUI = widgetData;
            switch (form.formType) {
              case FormType.INFO:
                return <FullActivityTypeInfoLayout
                  form={form}
                  onLoaded={() => {
                    handleWidgetKeyChange(form.key)
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
              message={`No puede interpretar ${JSON.stringify(widgetData)}`}
            />
          );
        }}
      />
    </Modal>
  );
}

export default ActivityContentModal;
