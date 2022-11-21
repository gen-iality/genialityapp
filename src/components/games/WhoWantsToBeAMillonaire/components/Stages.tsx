import React, { useState } from 'react';
import { Drawer, List, Avatar, Button, Typography, Tooltip } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import FlagVariantIcon from '@2fd/ant-design-icons/lib/FlagVariant';
import { CloseOutlined } from '@ant-design/icons';
import ProgressStarIcon from '@2fd/ant-design-icons/lib/ProgressStar';

export default function Stages() {
  const { stages, currentStage, stage, statusGame } = useMillonaireLanding();
  const [isVisible, setIsVisible] = useState(false);
  const stagesOrderByStage = stages.sort((a, b) => b.stage - a.stage);

  return (
    <>
      <Button
        block
        type={statusGame === 'STARTED' ? 'primary' : 'default'}
        size='large'
        shape={statusGame === 'STARTED' ? 'round' : 'default'}
        style={
          statusGame === 'STARTED'
            ? { background: 'radial-gradient(129.07% 129.07% at 50% 56.98%, #120754 0%, #382485 100%)' }
            : undefined
        }
        onClick={() => setIsVisible(!isVisible)}>
        {statusGame === 'ANNOUNCEMENT' || statusGame === 'STARTED' ? (
          'Etapas'
        ) : (
          <Typography.Text strong>Etapas</Typography.Text>
        )}
      </Button>
      <Drawer
        className='editAnt'
        closeIcon={<CloseOutlined style={{ color: '#FFFFFF' }} />}
        headerStyle={{
          border: 'none',
          background: '#120754',
        }}
        bodyStyle={{ background: 'linear-gradient(180deg, #120754 0%, #382485 51.04%, #120754 100%)' }}
        visible={isVisible}
        onClose={() => setIsVisible(!isVisible)}>
        <List
          bordered={false}
          split={false}
          itemLayout='horizontal'
          dataSource={stagesOrderByStage}
          renderItem={(stage) => (
            <List.Item
              style={{
                borderRadius: '10px',
                padding: '8px 10px',
                backgroundColor: currentStage.stage === stage.stage ? '#FFB500' : '',
              }}
              extra={
                stage.lifeSaver && (
                  <Tooltip title='Seguro'>
                    <FlagVariantIcon
                      style={{ fontSize: '25px', color: currentStage.stage === stage.stage ? '#120754' : '#FFFFFF' }}
                    />
                  </Tooltip>
                )
              }>
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: currentStage.stage === stage.stage ? '#120754' : '#FFB500' }}>
                    {stage.stage}
                  </Avatar>
                }
                title={
                  <Typography.Text
                    strong
                    style={{ color: currentStage.stage === stage.stage ? '#120754' : '#FFFFFF', fontSize: '18px' }}>
                    <ProgressStarIcon style={{ fontSize: '20px' }} /> {stage.score}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
}
