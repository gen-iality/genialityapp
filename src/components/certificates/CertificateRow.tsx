import { DeleteFilled } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Typography } from 'antd';
import { CertRow } from 'html2pdf-certs/dist/types/components/html2pdf-certs/types';


const certRowTypeToTitle: {[key: string]: string} = {
  break: 'Salto',
  h1: 'Título 1',
  h2: 'Título 2',
  h3: 'Subtítulo 1',
  h4: 'Subtítulo 2',
  text: 'Texto',
}

interface ICertificateRowProps {
    value?: CertRow,
    onChange?: (data: CertRow) => void,
    showDeleteButton?: boolean,
    onDelete?: () => void,
    possibleType?: CertRow['type'][],
    title?: string,
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
    <Row gutter={[16, 16]} style={{borderColor: '#eee', borderWidth: 1, borderStyle: 'solid'}}>
      <Col span={1}>
        {showDeleteButton ? (
        <Button
          danger
          onClick={() => onDelete()}
          icon={<DeleteFilled />}
        />
        ) : undefined}
      </Col>
      <Col span={2}>
        <Typography.Text strong>{title}</Typography.Text>
      </Col>
      <Col span={3}>
        <InputNumber
          min={1}
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
      <Col span={4}>
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
      <Col span={14}>
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
};

export default CertificateRow;
