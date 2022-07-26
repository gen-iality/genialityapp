import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';

import { Typography, Layout, Row, Col, Button, } from 'antd';

import { ModalWrapperUIProps } from '../interfaces/ModalWrapperUIProps';
import {
  activityTypeKeys,
  activityTypeData,
  activitySubTypeKeys,
} from '@/context/activityType/schema/activityTypeFormStructure';
import {
  ActivityTypeCard,
  FormStructure,
  GeneralTypeName,
  ActivitySubTypeKey,
  ActivityTypeKey,
  WidgetType,
  GeneralTypeValue,
} from '@/context/activityType/schema/structureInterfaces';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const useGetNextElement = (item: ActivityTypeCard) => {
  let result: ActivityTypeCard[] | FormStructure | null = null;
  switch (item.widgetType) {
    case WidgetType.CARD_SET:
      result = item.cards;
      break;
    case WidgetType.FORM:
      result = item.form;
      break;
    case WidgetType.FINAL:
      result = null;
      break;
    default:
      new Error(`The widgetType (${item}) is invalid`);
  }
  return result;
}

const useActivityTypeData: (type: GeneralTypeValue) => ActivityTypeCard | FormStructure | null = (type) => {
  switch (type) {
    case activityTypeKeys.live:
      return activityTypeData.cards[0];

    // liveBroadcastCards
    case activitySubTypeKeys.streaming:
      return (activityTypeData.cards[0].cards as ActivityTypeCard[])[0] as ActivityTypeCard;
    case activitySubTypeKeys.vimeo:
      return (activityTypeData.cards[0].cards as ActivityTypeCard[])[1].form as FormStructure;
    case activitySubTypeKeys.youtube:
      return (activityTypeData.cards[0].cards as ActivityTypeCard[])[2].form as FormStructure;

    case activityTypeKeys.meeting:
      return activityTypeData.cards[1].form as FormStructure;

    case activityTypeKeys.video:
      return activityTypeData.cards[2];
    case activitySubTypeKeys.url:
      return (activityTypeData.cards[2].cards as ActivityTypeCard[])[0].form as FormStructure;
    case activitySubTypeKeys.file:
      return (activityTypeData.cards[2].cards as ActivityTypeCard[])[1].form as FormStructure;
    default:
      return null;
  }
}

export interface ActivityContentModalLayoutProps extends ModalWrapperUIProps {
  initialType: ActivitySubTypeKey,
  selected: GeneralTypeValue | null,
  onWidgetKeyChange: (key: GeneralTypeValue) => void,
  widget: ActivityTypeCard | FormStructure,
  disabledNextButton: boolean,
  render: (widgetData: ActivityTypeCard | FormStructure) => React.ReactNode,
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
  const [widgetData, setWidgetData] = useState<ActivityTypeCard | FormStructure>(initialWidget);

  useEffect(() => setWidgetData(initialWidget), [initialWidget]);

  const handleGoBack = () => {
    // Take the last type, remove it
    const newWidgetKeyStack = [...widgetKeyStack];
    const key = newWidgetKeyStack.pop();
    setWidgetKeyStack(newWidgetKeyStack);
    if (key) onWidgetKeyChange(key as GeneralTypeValue);

    // If no last type, close the modal
    if (key === undefined) {
      onClose();
      return;
    }

    // The last type will be the current type
    setWidgetKey(key);
    // Reload the widget according to last type
    console.log(newWidgetKeyStack, key);
    const data = useActivityTypeData(key as GeneralTypeValue);
    console.log('go back:', data);
    if (data) setWidgetData(data);
  };

  const handleGoForward = () => {
    if (!widgetData) {
      console.warn('options is invalid');
      return;
    }
    if (selected) {
      // Close modal and create a transmission...
      const transmissions: GeneralTypeValue[] = [
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
      console.log(`useActivityTypeData (for ${selected}):`);

      // Get that card/form
      console.log(newTypeStack, selected);
      const data = useActivityTypeData(selected);
      console.log('go forward:', data);
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
