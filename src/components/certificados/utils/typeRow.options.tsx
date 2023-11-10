import { Typography } from 'antd';

export const certificateElementType = {
	h1:'Título',
	h2:'Título 1',
	h3:'Título 2',
	h4:'Subtítulo',
	h5:'Subtítulo 1',
	p:'Párrafo',
	break:'Salto de línea'
}
export const typeRowOptions = [
	{
		value: 'h1',
		label: <Typography.Text style={{ fontSize: '2em' }}>{certificateElementType.h1}</Typography.Text>,
	},
	{
		value: 'h2',
		label: <Typography.Text style={{ fontSize: '1.5em' }}>{certificateElementType.h2}</Typography.Text>,
	},
	{
		value: 'h3',
		label: <Typography.Text style={{ fontSize: '1.17em' }}>{certificateElementType.h3}</Typography.Text>,
	},
	{
		value: 'h4',
		label: <Typography.Text style={{ fontSize: '1em' }}>{certificateElementType.h4}</Typography.Text>,
	},
	{
		value: 'h5',
		label: <Typography.Text style={{ fontSize: '0.83em' }}>{certificateElementType.h5}</Typography.Text>,
	},
	{
		value: 'p',
		label: <Typography.Text style={{ fontSize: '1.3em' }}>{certificateElementType.p}</Typography.Text>,
	},
	{
		value: 'break',
		label: certificateElementType.break,
	},
];


