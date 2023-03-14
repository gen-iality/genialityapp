import { CaretDownOutlined } from '@ant-design/icons'
import { Button, Collapse, Typography } from 'antd'
import React from 'react'
import { IMeeting } from '../interfaces/meetings.interfaces';

export default function MeetingItem( {date, name , place ,participants} : IMeeting) {
  return (
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
  )
}
