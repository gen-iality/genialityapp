import React from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
const AttendeeCheckInButtonPrint = ({ onPrintUser }: { onPrintUser: () => void }) => {
  return (
    <Button onClick={onPrintUser} size='small' type='primary' block={true} icon={<PrinterOutlined />}>
      Imprimir Escarapela
    </Button>
  );
};

export default AttendeeCheckInButtonPrint;
