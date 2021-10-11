import React from 'react';
import { Button, Typography } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;
export const columns = (goToEvent) => [
   {
      title: 'Nombre del evento',
      dataIndex: 'name',
      align: 'center',
      render(val, item) {
         return (
            <Paragraph
               onClick={() => goToEvent(item._id)}
               style={{ width: 250, color: '#2E9AFE', textDecorationLine: 'underline', cursor: 'pointer' }}
               ellipsis={{
                  rows: 1,
                  tooltip: `${item.name}`,
               }}>
               {item.name}
            </Paragraph>
         );
      },
      fixed: 'left',
   },
   {
      title: 'Total usuarios',
      dataIndex: 'count',
      align: 'center',
   },
   {
      title: 'Usuarios sin checkIn',
      dataIndex: 'checked_in_not',
      align: 'center',
      render(val, item) {
         return item.checked_in_not;
      },
   },
   {
      title: 'Usuarios con checkIn',
      dataIndex: 'checked_in',
      align: 'center',
      render(val, item) {
         return item.checked_in;
      },
   },
];
