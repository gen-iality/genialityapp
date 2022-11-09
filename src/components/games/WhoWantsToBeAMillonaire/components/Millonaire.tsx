import React from 'react';
import { Button, Space, Typography } from 'antd';

const { Title, Paragraph } = Typography;
export default function Millonaire() {
  //   const { time, score, question, answers } = useMillonaireLanding();
  return (
    <div>
      <span>30 segundo</span>
      <span>100 </span>
      <Paragraph>"Quien es goku"</Paragraph>
      <Space>
        <Button>respuesta 1</Button>
        <Button>respuesta 2</Button>
        <Button>respuesta 3</Button>
        <Button>respuesta 4</Button>
      </Space>
    </div>
  );
}
