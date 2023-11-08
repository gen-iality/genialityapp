import { Rule } from 'antd/lib/form';

export const timesRules: Rule[] = [
  { type: 'number', min: 1, max: 10, message: 'Solo se permite saltos entre 1 y 10' },
  {
    required: true,
    message: 'El contenido es obligatorio',
  },
];

export const contentRules: Rule[] = [
  {
    required: true,
    message: 'El contenido es obligatorio',
  },
];

export const rulesType = {
  text: contentRules,
  number: timesRules,
};
