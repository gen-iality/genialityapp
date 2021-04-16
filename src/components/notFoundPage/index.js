import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

export default function NotFoundPage() {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Lo sentimos, la página que está visitando no existe.'
      extra={
        <Link to={'/'}>
          <Button type='primary'>Ir a la página principal</Button>
        </Link>
      }
    />
  );
}
