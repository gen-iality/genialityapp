import { CaretDownOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Typography } from 'antd';
import React from 'react';

export default function MeetingList() {
  return (
    <Card headStyle={{ border: 'none' }} bodyStyle={{ paddingTop: '0px' }}>
      <Collapse
        expandIcon={({ isActive }) => (
          <Button type='text' shape='circle' icon={<CaretDownOutlined rotate={isActive ? 180 : 0} />}></Button>
        )}
        bordered={false}
        style={{ backgroundColor: '#F9FAFE' }}>
        <Collapse.Panel
          key='1'
          header={
            <Typography.Text style={{ fontSize: '20px', fontWeight: '700', color: '#6F737C' }}>prueba</Typography.Text>
          }></Collapse.Panel>
      </Collapse>
    </Card>
  );
}
