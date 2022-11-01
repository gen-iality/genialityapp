import { Space, Col, Affix, Card, Form, Input, Button, Select } from 'antd';
import { Question } from 'survey-react';
import CreateMillonaire from './CreateMillonaire';
import QuestionSettings from './QuestionSettings';
const GeneralConfiguration = () => {
  return (
    <Space>
      <CreateMillonaire />

      <QuestionSettings />
    </Space>
  );
};
export default GeneralConfiguration;
