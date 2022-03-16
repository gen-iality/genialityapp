import React from 'react';
import { Result } from 'antd';

/**
 * Título varia según lo seleccionado
 * Transmisión: Transmisión creada correctamente
 * Reunión: Reunión creada correctamente
 * Video: Video asignado correctamente
 */
interface propsOptions {
  title: string;
  status: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
  subtitle?: string;
}

const ResultTypeActivity = ({ title, status, subtitle }: propsOptions) => {
  return <Result status={status} title={title} subTitle={subtitle} />;
};

export default ResultTypeActivity;
