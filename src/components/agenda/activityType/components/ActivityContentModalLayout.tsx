import { ReactNode } from 'react';
import { useMemo, useEffect } from 'react';

import { Typography, Layout, Row, Col, Button, } from 'antd';

import { ModalWrapperUIProps } from '../interfaces/ModalWrapperUIProps';

import type { ActivityType } from '@context/activityType/types/activityType';
import { WidgetType } from '@context/activityType/constants/enum';

export type WidgetData = ActivityType.CardUI | ActivityType.FormUI;
export type WidgetKeyStack = ActivityType.GeneralTypeValue[];

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export interface ActivityContentModalLayoutProps extends ModalWrapperUIProps {
  selected: ActivityType.GeneralTypeValue | null,
  disabledNextButton: boolean,
  render: (widgetData: ActivityType.CardUI | ActivityType.FormUI) => ReactNode,
  // Internal inhereted states
  widgetKeyStack: WidgetKeyStack,
  setWidgetKeyStack: (x: WidgetKeyStack) => void,
  widgetData: WidgetData | null,
};

function ActivityContentModalLayout(props: ActivityContentModalLayoutProps) {
  const {
    disabledNextButton,
    selected,
    render,
    // Inheret
    title,
    onClose = () => {},
    onConfirm = () => {},
    // ...
    widgetKeyStack,
    setWidgetKeyStack,
    widgetData,
  } = props;

  const handleGoBack = () => {
    // Take the last type, remove it
    const newWidgetKeyStack = [...widgetKeyStack];
    newWidgetKeyStack.pop(); // Delete the last
    setWidgetKeyStack(newWidgetKeyStack);
    
    // If no last type, close the modal
    if (widgetKeyStack.length <= 1) {
      onClose();
      return;
    }
    
    console.debug('go back', widgetKeyStack);
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
        onConfirm();
        console.debug('confirm saving data from form');
        return;
      }

      // The current type will be the last type. Update the type stack
      const newTypeStack = [...widgetKeyStack, selected];
      setWidgetKeyStack(newTypeStack);

      // Get that card/form
      console.debug(newTypeStack, selected);
      console.debug('go forward:', widgetKeyStack);
    }
  };

  const isTimeToCreate = useMemo(() => {
    if (!widgetData) return false;
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
        {widgetData && render(widgetData)}
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
              disabled={disabledNextButton}
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
