import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';

import { Typography, Layout, Row, Col, Button, } from 'antd';

import { ModalWrapperUIProps } from '../interfaces/ModalWrapperUIProps';
import {
  activityTypeNames,
  formWidgetFlow,
  activityContentValues,
} from '@context/activityType/constants/ui';
import type { ActivityType } from '@context/activityType/types/activityType';
import { WidgetType } from '@context/activityType/constants/enum';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const useActivityTypeData: (type: ActivityType.GeneralTypeValue) => ActivityType.CardUI | ActivityType.FormUI | null = (type) => {
  switch (type) {
    case activityTypeNames.live:
      return formWidgetFlow.cards[0];

    // liveBroadcastCards
    case activityContentValues.streaming:
      return (formWidgetFlow.cards[0].cards as ActivityType.CardUI[])[0] as ActivityType.CardUI;
    case activityContentValues.vimeo:
      return (formWidgetFlow.cards[0].cards as ActivityType.CardUI[])[1].form as ActivityType.FormUI;
    case activityContentValues.youtube:
      return (formWidgetFlow.cards[0].cards as ActivityType.CardUI[])[2].form as ActivityType.FormUI;

    case activityTypeNames.meeting:
      return formWidgetFlow.cards[1].form as ActivityType.FormUI;

    case activityTypeNames.video:
      return formWidgetFlow.cards[2];
    case activityContentValues.url:
      return (formWidgetFlow.cards[2].cards as ActivityType.CardUI[])[0].form as ActivityType.FormUI;
    case activityContentValues.file:
      return (formWidgetFlow.cards[2].cards as ActivityType.CardUI[])[1].form as ActivityType.FormUI;
    default:
      return null;
  }
}

export interface ActivityContentModalLayoutProps extends ModalWrapperUIProps {
  initialType: ActivityType.DeepUIKey,
  selected: ActivityType.GeneralTypeValue | null,
  onWidgetKeyChange: (key: ActivityType.GeneralTypeValue) => void,
  widget: ActivityType.CardUI | ActivityType.FormUI,
  disabledNextButton: boolean,
  render: (widgetData: ActivityType.CardUI | ActivityType.FormUI) => React.ReactNode,
};

function ActivityContentModalLayout(props: ActivityContentModalLayoutProps) {
  const {
    initialType,
    selected,
    onWidgetKeyChange,
    disabledNextButton: enableNextButton,
    render,
    widget: initialWidget,
    // Inheret
    title,
    onClose = () => {},
    onConfirm = () => {},
  } = props;

  const [widgetKeyStack, setWidgetKeyStack] = useState<string[]>([]);
  const [widgetKey, setWidgetKey] = useState<string>(initialType);
  const [widgetData, setWidgetData] = useState<ActivityType.CardUI | ActivityType.FormUI>(initialWidget);

  useEffect(() => setWidgetData(initialWidget), [initialWidget]);

  const handleGoBack = () => {
    // Take the last type, remove it
    const newWidgetKeyStack = [...widgetKeyStack];
    const key = newWidgetKeyStack.pop();
    setWidgetKeyStack(newWidgetKeyStack);
    if (key) onWidgetKeyChange(key as ActivityType.GeneralTypeValue);

    // If no last type, close the modal
    if (key === undefined) {
      onClose();
      return;
    }

    // The last type will be the current type
    setWidgetKey(key);
    // Reload the widget according to last type
    console.debug(newWidgetKeyStack, key);
    const data = useActivityTypeData(key as ActivityType.GeneralTypeValue);
    console.debug('go back:', data);
    if (data) setWidgetData(data);
  };

  const handleGoForward = () => {
    if (!widgetData) {
      console.warn('options is invalid');
      return;
    }
    if (selected) {
      // Close modal and create a transmission...
      const transmissions: ActivityType.GeneralTypeValue[] = [
        'RTMP',
        'eviusMeet',
      ];
      if (transmissions.includes(selected) || isTimeToCreate) {
        // TODO: ok, take the data, process them, and close the modal
        setWidgetKeyStack([]);
        setWidgetKey(initialType);
        setWidgetData(initialWidget);
        onConfirm();
        // onClose();
        console.debug('confirm saving data from form');
        return;
      }

      // The current type will be the last type. Update the type stack
      const newTypeStack = [...widgetKeyStack, widgetKey];
      setWidgetKeyStack(newTypeStack);
      setWidgetKey(selected);
      // onSelectChange(selected)
      console.debug(`useActivityTypeData (for ${selected}):`);

      // Get that card/form
      console.debug(newTypeStack, selected);
      const data = useActivityTypeData(selected);
      console.debug('go forward:', data);
      if (data) setWidgetData(data);

      // TODO: detect if it was the end to close the modal, and confirm the data type
    }
  };

  const isTimeToCreate = useMemo(() => {
    if ('widgetType' in widgetData && (widgetData.widgetType === WidgetType.FINAL || widgetData.widgetType === WidgetType.FORM))
      return true;
    else if ('formType' in widgetData) return true;
    else return false;
  }, [widgetData]);

  const nextButtonString = useMemo(() => {
    if (isTimeToCreate) return 'Crear';
    return 'Siguiente';
  }, [isTimeToCreate]);

  return (
    <Layout>
      <Header style={{ textAlign: 'center', padding: '20px 0px 20px 0px' }}>
        <Title level={3}>
          {title}
        </Title>
      </Header>

      <Content style={{ padding: '60px 50px 60px 50px' }}>
        {render(widgetData)}
      </Content>

      <Footer style={{ backgroundColor: '#fff', padding: '20px 0px 0px 0px' }}>
        <Row justify='end' gutter={[8, 8]}>
          <Col>
            <Button onClick={handleGoBack}>
              Atrás
            </Button>
          </Col>
          <Col>
            <Button
              disabled={enableNextButton}
              onClick={handleGoForward}
              type='primary'
            >
              {nextButtonString}
            </Button>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}

export default ActivityContentModalLayout;
