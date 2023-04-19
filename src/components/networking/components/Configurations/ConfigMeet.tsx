import { Button, Card, Col, Form, List, Row, Tabs, Grid, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { UseEventContext } from '@/context/eventContext';
import Toolbar from '../../../agenda/activityType/components/manager/eviusMeet/Toolbar';
import { generalItems } from '../../../agenda/activityType/components/manager/eviusMeet/generalItems';
import { MeetConfig, networkingGlobalConfig } from '../../interfaces/Index.interfaces';
import { INITIAL_MEET_CONFIG } from '../../utils/utils';
import { SaveOutlined } from '@ant-design/icons';
import { getConfig, updateConfig } from '../../services/configuration.service';
import { DispatchMessageService } from '@/context/MessageService';

const { useBreakpoint } = Grid;

export interface ElementProps {
  meetConfig: MeetConfig;
  setMeetConfig: React.Dispatch<React.SetStateAction<MeetConfig>>;
}

export interface ShareMeetLinkCardProps {
  activityId: string;
}

export default function ConfigMeet() {
  const eventContext = UseEventContext();
  const eventId = eventContext?.idEvent;
  const [meetConfig, setMeetConfig] = useState<MeetConfig>(INITIAL_MEET_CONFIG);
  const [loading, setLoading] = useState(false);
  const screens = useBreakpoint();

  useEffect(() => {
    loadConfigMeet();
	// eslint-disable-next-line
  }, []);

  const loadConfigMeet = async () => {
	const data = await getConfig<networkingGlobalConfig>(eventId);
	if (data?.ConfigMeet) setMeetConfig(data.ConfigMeet);
  };

  const uptadeConfig = async () => {
    setLoading(true);
    const response = await updateConfig(eventId, {ConfigMeet: meetConfig});
    DispatchMessageService({
      action: 'show',
      duration: 1,
      key: 'config',
      msj: response ? 'Configuración guardada' : 'No se logro guardar la configuración',
      type: response ? 'success' : 'error',
    });
    setLoading(false);
  };

  return (
    <>
      <Card 
        hoverable 
        style={{ height: "100%", backgroundColor: '#FDFEFE'}} 
        title={
          <Tooltip placement='top' title='Configuración de meet'><Typography.Text strong>Configuración de <br /> meet</Typography.Text></Tooltip>}
        headStyle={{border: 'none'}}
        extra={
          <Tooltip placement='top' title='Guardar configuración'>
            <Button
              type='primary'
              loading={loading}
              icon={<SaveOutlined />}
              onClick={uptadeConfig}
            >
              Guardar
            </Button>
          </Tooltip>
        }
      >
        <Tabs>
          <Tabs.TabPane
            className={!screens.xs ? 'desplazar' : ''}
            style={{ height: '40vh', overflowY: 'auto' }}
            tab='General'
            key='item-general'>
            <Form layout='vertical'>
              <Card bordered={false}>
                <List
                  size='small'
                  dataSource={generalItems}
                  renderItem={(option: any) => (
                    <List.Item
                      style={{ padding: '0px' }}
                      key={option.key}
                      extra={
                        <Form.Item style={{ margin: '10px' }}>
                          {option.element({ meetConfig, setMeetConfig })}
                        </Form.Item>
                      }>
                      <List.Item.Meta title={option.label} />
                    </List.Item>
                  )}
                />
              </Card>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane
            className={!screens.xs ? 'desplazar' : ''}
            style={{ overflowY: 'auto', height: 380 }}
            tab='Herramientas'
            key='item-toolbar'>
            <Toolbar
              values={meetConfig.config.toolbarButtons}
              onChange={(list: any) =>
                setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, toolbarButtons: list } }))
              }
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </>
  );
}
