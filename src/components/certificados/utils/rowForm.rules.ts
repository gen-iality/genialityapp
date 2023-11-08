import { Rule } from 'antd/lib/form';

export const contentRules: Rule[] = [
  { type: 'number', min: 1, max: 10, message: 'Solo se permite saltos entre 1 y 10' },
];

export const timesRules: Rule[] = [
  {
    required: true,
    message: 'El contenido es obligatorio',
  },
];

export const rulesType = {
  text: timesRules,
  number: contentRules,
};
