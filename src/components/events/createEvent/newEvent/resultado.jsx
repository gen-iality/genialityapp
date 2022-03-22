import { Result, Button } from 'antd';

const Resultado = () => {
  return (
    <div>
      <Result
        status='success' // estados: success | error | info | warning | 404 | 403 | 500
        title='El evento ha sido creado exitosamente'
        subTitle='si desea ver más opciones de configuración diríjase a “Administrar el evento”'
        extra={[
          <Button size='large' type='primary' key='landing'>
            Ir al evento
          </Button>,
          <Button size='large' key='cms'>
            Administrar el evento
          </Button>,
        ]}
      />
      ,
    </div>
  );
};

export default Resultado;
