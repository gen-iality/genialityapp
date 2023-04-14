import { Button, Card, Col, Form, List, Row, Tabs, Grid, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { UseEventContext } from '@/context/eventContext';
import Toolbar from '../../../agenda/activityType/components/manager/eviusMeet/Toolbar';
import { generalItems } from '../../../agenda/activityType/components/manager/eviusMeet/generalItems';
import { MeetConfig, networkingGlobalConfig } from '../../interfaces/Index.interfaces';
import { INITIAL_MEET_CONFIG } from '../../utils/utils';
import { SaveOutlined } from '@ant-design/icons';
import { getConfig, updateOrCreateConfigMeet } from '../../services/configuration.service';
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
    const response = await updateOrCreateConfigMeet(eventId, {ConfigMeet: meetConfig});
    DispatchMessageService({
      action: 'show',
      duration: 1,
      key: 'config',
      msj: response ? 'Configuracion guardada' : 'No se logro guardar la configuracion',
      type: response ? 'success' : 'error',
    });
    setLoading(false);
  };

  return (
    <>
      <Row justify='end'>
       <Tooltip placement='top' title='Guardar Configuracion'>
       <Button
          type='primary'
          loading={loading}
          icon={<SaveOutlined />}
          style={{ position: 'fixed', zIndex: 1 }}
          onClick={uptadeConfig}
        />
       </Tooltip>
      </Row>
      <Row>
        <Col xs={24}>
          <Tabs>
            <Tabs.TabPane
              className={!screens.xs ? 'desplazar' : ''}
              style={{ height: '60vh', overflowY: 'auto' }}
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
              tab='Toolbar'
              key='item-toolbar'>
              <Toolbar
                values={meetConfig.config.toolbarButtons}
                onChange={(list: any) =>
                  setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, toolbarButtons: list } }))
                }
              />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}
