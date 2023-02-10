/** AntD's imports */
import { CheckCircleFilled } from '@ant-design/icons';
import { Badge, Checkbox, Col, Divider, Form, Row, Space, Typography } from 'antd';
import { ReactNode, useState } from 'react';

const { Text } = Typography;

export interface CardSelectorProps {
  selected?: string;
  options: {
    id: string;
    title: string;
    body: string | ReactNode;
    checkbox?: { text: string; onCheck: (checked: boolean) => void; initialCheck?: boolean };
  }[];
  onSelected: (id: string) => void;
}

export const CardSelector = (props: CardSelectorProps) => {
  const [currentSelected, setCurrentSelected] = useState(props.selected);

  return (
    <Row justify='center' wrap gutter={[8, 8]}>
      <Col span={16}>
        <Form.Item label={''}>
          <Row gutter={[16, 16]} wrap>
            {props.options.map((option) => (
              <Col key={option.id} xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                <Badge
                  count={
                    option.id === currentSelected ? (
                      <CheckCircleFilled style={{ fontSize: '25px', color: '#3CC4B9' }} />
                    ) : (
                      ''
                    )
                  }
                >
                  <div
                    style={{
                      border: '1px solid #D3D3D3',
                      borderRadius: '5px',
                      padding: '10px',
                      cursor: 'pointer',
                      minHeight: '170px',
                      maxWidth: '220px',
                    }}
                  >
                    <Space direction='vertical'>
                      <div
                        onClick={() => {
                          props.onSelected(option.id);
                          setCurrentSelected(option.id);
                        }}
                      >
                        <Text strong>{option.title}</Text>
                        <Divider />
                        <Text type='secondary'>{option.body}</Text>
                      </div>
                      {currentSelected === option.id && option.checkbox !== undefined && (
                        <>
                          <Divider />
                          <Checkbox
                            checked={option.checkbox.initialCheck}
                            onChange={(e) => option.checkbox!.onCheck(e.target.checked)}
                          >
                            {option.checkbox.text}
                          </Checkbox>
                        </>
                      )}
                    </Space>
                  </div>
                </Badge>
              </Col>
            ))}
          </Row>
        </Form.Item>
      </Col>
    </Row>
  );
};