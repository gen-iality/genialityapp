import { CertifiRow } from '@/components/agenda/types';
import { Button, Card, Col, Drawer, DrawerProps, Form, Row, Select, Tooltip, Typography } from 'antd';
import { typeRowOptions } from '../utils/typeRow.options';
import { useEffect, useState } from 'react';
import { SaveFilled, TagOutlined } from '@ant-design/icons';
import { ITagRow, RowCert } from '../types';
import { InputRowConfig } from './InputRowConfig';
interface Props extends DrawerProps {
	onClose: () => void;
	selectedRow?: CertifiRow;
	handledEdit: (certificatesRowId: string, newRowCertificate: Partial<CertifiRow>) => void;
	handledAdd: (newCertificateRowForm: Omit<CertifiRow, 'id'>) => void;
	allTags: ITagRow[];
}

const RowConfiguration = ({ onClose, selectedRow, handledEdit, handledAdd, allTags, ...drawerProps }: Props) => {
	const [typeSelected, setTypeSelected] = useState<RowCert>();
	const [form] = Form.useForm<CertifiRow>();
	const [isFormModified, setIsFormModified] = useState(false);
	const { Paragraph } = Typography;
	const [currentTextInput, setCurrentTextInput] = useState<string>();

	const onChangeInput = (value: any) => {
		setCurrentTextInput(value);
	};
	const onChange = (value: any) => {
		setTypeSelected(value);
	};

	const onFinishForm = async (value: CertifiRow) => {
		if (selectedRow) {
			handledEdit(selectedRow.id, value);
		} else {
			handledAdd(value);
		}
		onClose();
	};

	const handleFormChange = () => {
		setIsFormModified(true);
	};

	const handleParagraphClick = (tag: string) => {
		const newValue = currentTextInput ? `${currentTextInput} [${tag}] ` : `[${tag}]`;
		form.setFieldsValue({ content: newValue });
		setCurrentTextInput(newValue);
	};

	useEffect(() => {
		if (selectedRow) {
			form.setFieldsValue({
				type: selectedRow.type,
				content: selectedRow.content,
				times: selectedRow.times,
				id: selectedRow.id,
			});
			setCurrentTextInput(selectedRow.content);
			setTypeSelected(selectedRow.type);
		}
	}, [selectedRow, form]);

	useEffect(() => {
		onChangeInput('');
	}, [typeSelected]);

	return (
		<Drawer onClose={onClose} title={selectedRow ? 'Editor de fila' : 'Agregar fila'} {...drawerProps}>
			<Form onFinish={onFinishForm} form={form} layout='vertical' onValuesChange={handleFormChange} size='large'>
				<Form.Item label='Tipo' name={'type'}>
					<Select placeholder='Seleccione un tipo para agregar' options={typeRowOptions} onChange={onChange} />
				</Form.Item>
				{/* <InputRowConfig typeSelected={typeSelected} /> */}
				<InputRowConfig typeSelected={typeSelected} onChangeInput={onChangeInput} />{' '}
				{/* Pasa el manejador a InputRowConfig */}
				{typeSelected && typeSelected !== 'break' && (
					<Form.Item label={'Etiquetas Disponibles'}>
						<Card>
							<Paragraph>
								Utiliza etiquetas para ingresar información referente al evento o a los asistentes. Haz clic en la
								propiedad que deseas agregar.
							</Paragraph>
							<Row wrap gutter={[12, 12]}>
								{allTags.map((item, key) => (
									<Col key={key}>
										<Tooltip placement='left' title='Clic para agregar esta propiedad al contenido'>
											<Button
												size='small'
												shape='round'
												icon={<TagOutlined />}
												onClick={() => handleParagraphClick(item.tag)}>
												{item.label}
											</Button>
										</Tooltip>
									</Col>
								))}
							</Row>
						</Card>
					</Form.Item>
				)}
				<Form.Item>
					<Button type='primary' icon={<SaveFilled />} htmlType='submit' disabled={!isFormModified}>
						Guardar
					</Button>
				</Form.Item>
			</Form>
		</Drawer>
	);
};

export default RowConfiguration;
