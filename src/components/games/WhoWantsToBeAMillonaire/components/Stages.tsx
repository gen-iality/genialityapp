import React, { useState } from 'react';
import { Drawer, List, Avatar, Button } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import { SaveFilled } from '@ant-design/icons';

export default function Stages() {
  const { stages, currentStage } = useMillonaireLanding();
  const [isVisible, setIsVisible] = useState(false);
  const stagesOrderByStage = stages.sort((a, b) => b.stage - a.stage);
  return (
    <>
      <Button onClick={() => setIsVisible(!isVisible)}>Etapas</Button>
      <Drawer title='Etapas' visible={isVisible} onClose={() => setIsVisible(!isVisible)}>
        <List
          itemLayout='horizontal'
          dataSource={stagesOrderByStage}
          renderItem={(stage) => (
            <List.Item
              style={{
                backgroundColor: currentStage.stage === stage.stage ? '#ee333e' : '',
              }}>
              <List.Item.Meta avatar={<Avatar>{stage.stage}</Avatar>} title={<p>{stage.score}</p>} />
              {stage.lifeSaver && (
                <div>
                  <SaveFilled />
                </div>
              )}
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
}
