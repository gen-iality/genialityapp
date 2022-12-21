import { Card, Form, Input } from 'antd';
import Header from '@/antdComponents/Header';
import Loading from '@/components/profile/loading';
import useWhereIs from '../../hooks/useWhereIs';

interface Props {
	eventId: string;
}

export default function CreateWhereIs(props: Props) {
  const { eventId } = props;
  const { createWhereIs, loading } = useWhereIs();

  const handleFinish = (values: { title: string }) => {
    createWhereIs({
      title: values.title,
    });
  };

  if (loading) return <Loading />;
  return (
    <Form onFinish={handleFinish} layout='vertical'>
      <Header title={'Buscando el Elemento'} description={''} back form save={true} />
      <Card style={{ marginTop: 12 }}>
        <Form.Item
          label={'Nombre de la dinamica'}
          name='title'
          rules={[{ required: true, message: 'El nombre es requerido' }]}>
          <Input placeholder={'Mi dinamica'} showCount maxLength={50} />
        </Form.Item>
      </Card>
    </Form>
  )
}
