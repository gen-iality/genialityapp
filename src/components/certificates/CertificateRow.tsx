import { DeleteFilled } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import { CertRow } from 'html2pdf-certs/dist/types/components/html2pdf-certs/types'

const certRowTypeToTitle: { [key: string]: string } = {
  break: 'Salto',
  h1: 'Título 1',
  h2: 'Título 2',
  h3: 'Subtítulo 1',
  h4: 'Subtítulo 2',
  text: 'Texto',
}

interface ICertificateRowProps {
  value?: CertRow
  onChange?: (data: CertRow) => void
  showDeleteButton?: boolean
  onDelete?: () => void
  possibleType?: CertRow['type'][]
  title?: string
}

const CertificateRow: React.FunctionComponent<ICertificateRowProps> = (props) => {
  const {
    value: certRow = {},
    onChange = () => {},
    onDelete = () => {},
    showDeleteButton,
    possibleType = [],
    title = 'Fila',
  } = props

  return (
    <Row
      wrap
      gutter={[16, 16]}
      style={{ borderColor: '#eee', borderWidth: 1, borderStyle: 'solid' }}
    >
      <Col md={1} xs={4}>
        {showDeleteButton ? (
          <Button danger onClick={() => onDelete()} icon={<DeleteFilled />} />
        ) : undefined}
      </Col>
      <Col md={2} xs={20}>
        <Typography.Text strong>{title}</Typography.Text>
      </Col>
      <Col md={3} xs={12}>
        <InputNumber
          min={1}
          disabled={certRow.type !== 'break'}
          title="Cantidad de repeticiones de esta fila. Sólo para tipo salto de línea"
          defaultValue={certRow.times || 1}
          placeholder="Sólo para tipo break"
          onChange={(value) => {
            onChange({
              ...certRow,
              times: value || 1,
            })
          }}
        />
      </Col>
      <Col md={4} xs={12}>
        <Select
          options={possibleType.map((type) => ({
            value: type,
            label: type ? certRowTypeToTitle[type] : 'Desconocido',
          }))}
          defaultValue={certRow.type}
          placeholder="Seleccione un tipo de fila"
          onChange={(value) => {
            onChange({
              ...certRow,
              type: value,
            })
          }}
        />
      </Col>
      <Col md={14} xs={24}>
        {/* TODO: Add support for content of type CertRow when its has children too */}
        <Input
          placeholder="Contenido"
          defaultValue={certRow.content as string}
          onChange={(e: any) => {
            onChange({
              ...certRow,
              content: e.target.value,
            })
          }}
        />
      </Col>
    </Row>
  )
}

export default CertificateRow
