import * as React from 'react';
import { useState, useEffect } from 'react';
import { Alert, Modal } from 'antd';

import ActivityTypeSelectableCards from './components/ActivityTypeSelectableCards';
// import { ActivityTypeSelectableCardsProps } from './components/ActivityTypeSelectableCards';

import ActivityContentModalLayout, { WidgetData } from './components/ActivityContentModalLayout';

import { ModalWrapperUIProps} from './interfaces/ModalWrapperUIProps';
import type { ActivityType } from  '@context/activityType/types/activityType';
import { FormType, WidgetType } from '@context/activityType/constants/enum';

import FullActivityTypeInfoLayout from './components/FullActivityTypeInfoLayout';

import ActivityVideoUploadField from './components/ActivityVideoUploadField';
import ActivityExternalUrlField from './components/ActivityExternalUrlField';

import { useGetWidgetForContentType } from '@/context/activityType/hooks/useGetWidgetForContentType';

export interface ActivityContentModalProps extends ModalWrapperUIProps {
  widget: ActivityType.CardUI | ActivityType.FormUI,
  onConfirmType: (key: ActivityType.GeneralTypeValue) => void,
  //
  isVisible: boolean,
  activityName: string,
  onInput?: (input: string) => void,
};

function ActivityContentModal(props: ActivityContentModalProps) {
  const {
    isVisible,
    activityName,
    onInput = () => {},
    // Inherent selectable
    widget,
    onConfirmType,
    // Inherent UI
    title,
    onClose = () => {},
  } = props;

  const [selected, setSelected] = useState<ActivityType.GeneralTypeValue | null>(null);
  const [widgetKeyStack, setWidgetKeyStack] = useState<ActivityType.GeneralTypeValue[]>([widget.key]);
  const [widgetKey, setWidgetKey] = useState<ActivityType.GeneralTypeValue | null>(widget.key);
  const [widgetData, setWidgetData] = useState<WidgetData | null>(widget);

  const handleCancel = () => onClose();

  /**
   * Save the last selected type as confirmed type. After close the modal.
   */
  const handleConfirm = () => {
    if (selected) {
      onConfirmType(selected);
      onClose(true);
      /* console.log('confirm content type as', selected); */
    } else {
      alert('No puede guardar dato vacío');
    }
  };

  /**
   * Receive a content type as widget key and save it in selected.
   * @param newKey new widget key that is equal to a content type.
   */
  const handleWidgetKeyChange = (newKey: ActivityType.GeneralTypeValue) => {
    /* console.log('selected changed to', newKey); */
    setSelected(newKey);
  };

  /**
   * When the widgetKey changes we have to get the next widget data.
   */
  useEffect(() => {
    const data = useGetWidgetForContentType(widgetKey as ActivityType.GeneralTypeValue);
    if (data) setWidgetData(data);
    /* console.debug('get data to key', widgetKey, ':', data); */
  }, [widgetKey]);

  /**
   * When the navigation of widgets change we have to take the last item as current item.
   */
  useEffect(() => {
    if (widgetKeyStack.length) {
      const [newWidgetKey] = widgetKeyStack.slice(-1);
      setWidgetKey(newWidgetKey);
      /* console.debug('current widget key is', newWidgetKey); */
    }
  }, [widgetKeyStack]);

  /**
   * When the modal is hidden, reset all the states.
   */
  useEffect(() => {
    if (!isVisible) {
      setSelected(null);
      setWidgetData(widget);
      setWidgetKey(widget.key);
      setWidgetKeyStack([widget.key]);
      /* console.debug('reset modal states'); */
    }
  }, [isVisible]);

  return (
    <Modal
      centered
      width={1200}
      footer={null}
      visible={isVisible}
      onCancel={handleCancel}
    >
      <ActivityContentModalLayout
        disabledNextButton={selected === null}
        title={title}
        selected={selected} // To know what is selected
        onClose={onClose}
        onConfirm={handleConfirm}
        // ...
        widgetKeyStack={widgetKeyStack}
        setWidgetKeyStack={setWidgetKeyStack}
        widgetData={widgetData}
        render={(widgetData: ActivityType.CardUI | ActivityType.FormUI) => {
          // console.debug(`render(${type}, ${JSON.stringify(data)})`);
          if ('widgetType' in widgetData) {
            const card: ActivityType.CardUI = widgetData;
            switch (card.widgetType) {
              case WidgetType.FORM:
                return <Alert message='Si esto se ve, se está pasando un card (que tiene un hijo form) en lugar de pasar el form...' />
              case WidgetType.CARD_SET:
                return <ActivityTypeSelectableCards
                  selected={selected}
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
