import { Form } from 'antd';
import Header from '@/antdComponents/Header';
import RenderView from './components/RenderView';
import MillonaireCMSProvider from './contexts/MillonaireCMSProvider';
import { useMillonaireCMS } from './hooks/useMillonaireCMS';

const FORMLAYOUT = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export default function Index() {
  return (
    <MillonaireCMSProvider>
      <MillonaireMain />
    </MillonaireCMSProvider>
  );
}

const MillonaireMain = () => {
  const { onSubmit, onDelete, isNewGame } = useMillonaireCMS();
  return (
    <Form onFinish={onSubmit} {...FORMLAYOUT}>
      <Header
        edit={isNewGame === false}
        title={'Quien quiere ser millonario'}
        description={''}
        back
        save
        form
        remove={onDelete}
      />
      <RenderView />
    </Form>
  );
};
