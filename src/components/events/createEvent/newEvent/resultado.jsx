import { Result, Button } from 'antd';

const Resultado = () => {
  return (
    <div>
      <Result
        status='success' // estados: success | error | info | warning | 404 | 403 | 500
        title='El curso ha sido creado exitosamente'
        subTitle='si desea ver más opciones de configuración diríjase a “Administrar el curso”'
        extra={[
          <Button size='large' type='primary' key='landing'>
            Ir al curso
          </Button>,
          <Button size='large' key='cms'>
            Administrar el curso
          </Button>,
        ]}
      />
      ,
    </div>
  );
};

export default Resultado;
