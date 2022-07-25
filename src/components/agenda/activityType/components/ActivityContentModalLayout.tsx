import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';

import { Typography, Layout, Row, Col, Button, } from 'antd';

import { ModalWrapperUIProps } from '../interfaces/ModalWrapperUIProps';
import { activityTypeKeys, activityTypeData, activitySubTypeKeys } from '../schema/activityTypeFormStructure';
import { ActivityTypeCard, FormStructure, GeneralTypeName, ActivitySubTypeNameType, ActivityTypeNameType, WidgetType, GeneralTypeValue, } from '../schema/structureInterfaces';

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
  initialType: ActivitySubTypeNameType,
  selected: GeneralTypeValue | null,
  onSelectChange: (selected: GeneralTypeValue) => void,
  widget: ActivityTypeCard | FormStructure,
  somethingWasSelected: boolean,
  render: (type: string | undefined, data: ActivityTypeCard | FormStructure) => React.ReactNode,
};

function ActivityContentModalLayout(props: ActivityContentModalLayoutProps) {
  const {
    initialType,
    selected,
    onSelectChange,
    somethingWasSelected,
    render,
    widget: initialWidget,
    // Inheret
    title,
    onClose = () => {},
    onConfirm = () => {},
  } = props;

  const [typeStack, setTypeStack] = useState<string[]>([]);
  const [type, setType] = useState<string>(initialType);
  const [data, setData] = useState<ActivityTypeCard | FormStructure>(initialWidget);
  const [isTimeToCreate, setIsTimeToCreate] = useState(false);

  useEffect(() => setData(initialWidget), [initialWidget]);

  const handleGoBack = () => {
    // Take the last type, remove it
    const newTypeStack = [...typeStack];
    const lastType = newTypeStack.pop();
    setTypeStack(newTypeStack);
    if (lastType) onSelectChange(lastType as GeneralTypeValue);

    // If no last type, close the modal
    if (lastType === undefined) {
      onClose();
      return;
    }

    // The last type will be the current type
    setType(lastType);
    // Reload the widget according to last type
    console.log(newTypeStack, lastType);
    const data = useActivityTypeData(lastType as GeneralTypeValue);
    console.log('go back:', data);
    if (data) setData(data);
  };

  const handleGoForward = () => {
    if (!data) {
      console.warn('options is invalid');
      return;
    }
    if (selected) {
      // Close modal and create a transmission...
      const transmissions: GeneralTypeValue[] = [
        'RTMP', 'eviusMeet',
      ];
      if (transmissions.includes(selected) || isTimeToCreate) {
        // TODO: ok, take the data, process them, and close the modal
        setTypeStack([]);
        setType(initialType);
        setData(initialWidget);
        console.debug('confirm saving data from form')
        onConfirm();
        onClose();
        return;
      }

      // The current type will be the last type. Update the type stack
      const newTypeStack = [...typeStack, type];
      setTypeStack(newTypeStack);
      setType(selected);
      // onSelectChange(selected)
      console.log(`useActivityTypeData (for ${selected}):`);

      // Get that card/form
      console.log(newTypeStack, selected);
      const data = useActivityTypeData(selected);
      console.log('go forward:', data);
      if (data) setData(data);

      // TODO: detect if it was the end to close the modal, and confirm the data type
    }
  };

  useEffect(() => {
    if ('widgetType' in data && (data.widgetType === WidgetType.FINAL || data.widgetType === WidgetType.FORM)) {
      setIsTimeToCreate(true);
    } else if ('formType' in data) {
      setIsTimeToCreate(true);
    } else {
      setIsTimeToCreate(false);
    }
  }, [data]);

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
        {render(type, data)}
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
              disabled={!somethingWasSelected}
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
