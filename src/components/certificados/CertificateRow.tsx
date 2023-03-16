import { DeleteFilled } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { CertRow } from 'html2pdf-certs/dist/types/components/html2pdf-certs/types';

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
    <Card
      title={(
      <div>
        {showDeleteButton ? (
        <Button
          danger
          onClick={() => onDelete()}
          icon={<DeleteFilled />}
        />
        ) : undefined}
        {' '}
        {title}
      </div>
      )}
      style={{ width: '100%' }}
  >
      <Row gutter={[16, 16]}>
      <Col span={8}>
        <Form.Item label="Tipo">
          <Select
            options={possibleType.map((type) => ({
              label: type,
              value: `Tipo ${type}`,
            }))}
            placeholder="Seleccione un tipo de fila"
            onChange={(value) => {
              onChange({
                ...certRow,
                type: value,
              })
            }}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Repeticiones (válido para tipo break)">
          <InputNumber
            style={{ width: 200 }}
            min={1}
            placeholder="Sólo para tipo break"
            onChange={(value) => {
              onChange({
                ...certRow,
                times: value || 1,
              })
            }}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Contenido">
          <Input
            placeholder="Contenido"
            onChange={(e: any) => {
              onChange({
                ...certRow,
                content: e.target.value,
              })
            }}
          />
        </Form.Item>
      </Col>
      </Row>
    </Card>
  );
};

export default CertificateRow;
