import { Card } from 'antd';
import React from 'react';
import MeetingItem from './MeetingItem';
import { IMeetingList } from '../interfaces/meetings.interfaces';

export default function MeetingList({ meentings } : IMeetingList) {

  return (
    <Card headStyle={{ border: 'none' }} bodyStyle={{ paddingTop: '0px' }}>
    {meentings.map((meenting, key)=> (
        <MeetingItem key={key} {...meenting}/>
    ))}
    </Card>
  );
}
