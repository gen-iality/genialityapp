import { Radio, Input, Space } from 'antd';

const TypeRegister = ({ setTypeRegister, typeRegister }) => {
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setTypeRegister(e.target.value);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <p>
        <strong>Tipo de registro</strong>
      </p>
      <Radio.Group onChange={onChange} value={typeRegister}>
        <Space direction='vertical'>
          {/*<Radio value={'free'}>Gratis (Tendrás acceso a todas las secciones)</Radio>*/}
          <Radio value={'pay'}>
            Pago $50.000 (Tendrás acceso a todas las secciones, y podrás realizar pujas por las obras)
          </Radio>
        </Space>
      </Radio.Group>
    </div>
  );
};

export default TypeRegister;
