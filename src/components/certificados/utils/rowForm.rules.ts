import { Rule } from 'antd/lib/form';

export const contentRules: Rule[] = [
  { min: 0, message: 'Debe ser mayor o igual a cero' },
  {
    required: true,
    message: 'El contenido es obligatorio',
  },
];
