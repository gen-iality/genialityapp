import { Space, Col, Affix, Card, Form, Input, Button, Select } from 'antd';
import { Question } from 'survey-react';
import CreateMillonaire from './CreateMillonaire';
import StageSettings from './StageSettings';
const GeneralConfiguration = () => {
  return (
    <Space>
      <CreateMillonaire />
      <StageSettings />
    </Space>
  );
};
export default GeneralConfiguration;
