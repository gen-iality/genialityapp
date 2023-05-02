import { PlusCircleFilled } from '@ant-design/icons'
import { Button, List, Typography } from 'antd'
import { CertRow } from 'html2pdf-certs/dist/types/components/html2pdf-certs/types'
import { useState } from 'react'
import CertificateRow from './CertificateRow'

interface ICertificateRowsProps {
  value?: CertRow[]
  onChange?: (data: CertRow[]) => void
}

const CertificateRows: React.FunctionComponent<ICertificateRowsProps> = (props) => {
  const { value: certRows = [], onChange = () => {} } = props

  const [possibleType, setPossibleType] = useState<CertRow['type'][]>([
    'break',
    'h1',
    'h2',
    'h3',
    'h4',
    'text',
  ])

  return (
    <List
      header={<Typography.Title>Filas</Typography.Title>}
      footer={
        <Button
          onClick={() => {
            onChange([...certRows, { type: 'text', content: '...' }])
          }}
          icon={<PlusCircleFilled />}>
          Agregar
        </Button>
      }
      bordered
      dataSource={certRows}
      renderItem={(item, index) => (
        <CertificateRow
          onChange={(changed) => {
            const newCertRows = [...certRows]
            newCertRows[index] = changed
            onChange(newCertRows)
          }}
          onDelete={() => {
            // This delete the last element always
            const newCertRows = [...certRows]
            newCertRows.splice(-1)
            onChange(newCertRows)
          }}
          possibleType={possibleType}
          showDeleteButton={index === certRows.length - 1}
          title={`Fila ${index + 1}`}
          value={item}
        />
      )}
    />
  )
}

export default CertificateRows
