import { Card, Form, Input } from 'antd';
import Header from '@/antdComponents/Header';
import useSharePhoto from '../../hooks/useSharePhoto';
import Loading from '@/components/profile/loading';

interface Props {
  eventId: string;
}

export default function CreateSharePhoto(props: Props) {
  const { eventId } = props;
  const { createSharePhoto, loading } = useSharePhoto();

  const handleFinish = (values: { title: string }) => {
    createSharePhoto({
      event_id: eventId,
      title: values.title,
    });
  };

  if (loading) return <Loading />;

  return (
    <Form onFinish={handleFinish} layout='vertical'>
      <Header title={'Dinamica Comparte tu Foto 📷'} description={''} back form save={true} />
      <Card style={{ marginTop: 12 }}>
        <Form.Item
          label={'Nombre de la dinamica'}
          name='title'
          rules={[{ required: true, message: 'El nombre es requerido' }]}>
          <Input placeholder={'Mi dinamica'} showCount maxLength={50} />
        </Form.Item>
      </Card>
    </Form>
  );
}
