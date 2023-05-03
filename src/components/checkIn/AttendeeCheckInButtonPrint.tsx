import React from 'react'
import { Button } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
const AttendeeCheckInButtonPrint = ({
  onPrintUser,
}: {
  onPrintUser: () => void | undefined
}) => {
  return (
    <Button onClick={onPrintUser} type="primary" block icon={<PrinterOutlined />}>
      Imprimir Escarapela
    </Button>
  )
}

export default AttendeeCheckInButtonPrint
