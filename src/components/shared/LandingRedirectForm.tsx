import { EventsApi } from '@/helpers/request';
import { Form, Switch } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  eventId: string;
  initialState: boolean | null;
  disabled: boolean;
  handleChangeRedirectForm: (value: boolean) => void;
}

export default function LandingRedirectForm(props: Props) {
  const [redirectLanding, setRedirectLanding] = useState(false);


  const handleChange = async (checked: boolean) => {
      setRedirectLanding(checked);
      props.handleChangeRedirectForm(checked);
      await EventsApi.editOne({ redirect_landing: checked }, props.eventId);
  };

  useEffect(() => {
    setRedirectLanding(props.initialState || false);
  }, []);

  useEffect(() => {
    if (props.disabled) {
      handleChange(false)
    }
  }, [props.disabled]);

  return (
    <Form.Item
      label={<label style={{ marginTop: '2%' }}>Redirigir al evento si ya estas registrado</label>}
      // rules={[{ required: true, message: 'El nombre es requerido' }]}
    >
      <Switch onChange={handleChange} checked={redirectLanding} disabled={props.disabled} />
    </Form.Item>
  );
}
