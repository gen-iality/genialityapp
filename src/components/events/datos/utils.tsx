import { Divider, List, Modal, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const { confirm } = Modal;
const { Text } = Typography;

const checkInInstructions = [
	'Si ya hay asistentes inscritos en el evento, se deberá actualizar la información de dicho campo.',
	'Esta función está disponible solo para cédula de ciudadanía Colombiana.',
	'Se requiere Lector de documentos.',
	'Durante la inscripción se almacenará la información capturada del documento.',
];

const checkInFields = [
	{
		id: undefined,
		name: 'checkInField',
		description: undefined,
		label: 'Documento',
		unique: false,
		mandatory: true,
		options: undefined,
		order_weight: undefined,
		type: 'checkInField',
		visibleByAdmin: true,
		visibleByContacts: undefined,
	},
	{
		id: undefined,
		name: 'gender',
		description: undefined,
		label: 'Genero',
		unique: false,
		mandatory: true,
		options: undefined,
		order_weight: undefined,
		type: 'text',
		visibleByAdmin: true,
		visibleByContacts: undefined,
	},
	{
		id: undefined,
		name: 'bloodtype',
		description: undefined,
		label: 'RH',
		unique: false,
		mandatory: true,
		options: undefined,
		order_weight: undefined,
		type: 'text',
		visibleByAdmin: true,
		visibleByContacts: undefined,
	},
	{
		id: undefined,
		name: 'birthdate',
		description: undefined,
		label: 'Fecha de nacimiento',
		unique: false,
		mandatory: true,
		options: undefined,
		order_weight: undefined,
		type: 'date',
		visibleByAdmin: true,
		visibleByContacts: undefined,
	},
];

// a little function to help us with reordering the result
export const Reorder = (list: any, startIndex: number, endIndex: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const grid = 6;
export const getItemStyle = (isDragging: any, draggableStyle: any) => {
	return {
		// some basic styles to make the items look a bit nicer
		userSelect: 'none',
		padding: grid * 2,
		margin: `0 0 ${grid}px 0`,
		textAlign: 'left',

		// change background colour if dragging
		background: isDragging ? 'lightgreen' : '#1BD5DF',

		// styles we need to apply on draggables
		...draggableStyle,
	};
};

export const getQuestionListStyle = (isDraggingOver: any) => ({
	background: isDraggingOver ? '#CA4FC4' : '',
	padding: 8,
	width: 350,
});

export const createFieldForCheckInPerDocument = async ({
	value,
	checkInFieldsIds,
	save,
	remove,
}: {
	value: CheckboxChangeEvent;
	checkInFieldsIds: string[];
	save: Function;
	remove: Function;
}) => {
	const saveCheckInField = async () => {
		checkInFields.map(async checkInField => {
			await save(checkInField);
		});
	};

	if (value.target.checked) {
		confirm({
			title: `Al habilitar el checkIn por documento, recuerda que:`,
			content: (
				<List
					size='small'
					dataSource={checkInInstructions}
					renderItem={(item, index) => (
						<List.Item>
							<Text>
								{index + 1}. {item}
							</Text>
						</List.Item>
					)}
				/>
			),
			okText: 'Habilitar',
			okType: 'primary',
			cancelText: 'Cancelar',
			onOk() {
				saveCheckInField();
			},
		});
	} else {
		confirm({
			title: `¿Se deshabilitará el checkIn por documento estás seguro?`,
			// content: 'Una vez eliminado, no lo podrá recuperar',
			okText: 'Si',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				checkInFieldsIds.map(async (checkInFieldId: string) => {
					await remove(checkInFieldId, true);
				});
			},
		});
	}
};

export const createTypeUserFild = async ({
	value,
	checkInFieldsIds,
	save,
	remove,
}: {
	value: CheckboxChangeEvent;
	checkInFieldsIds: string[];
	save: Function;
	remove: Function;
}) => {
	const saveTypeUserField = async () => {
		ListTypeUserFields.map(async checkInField => {
			await save(checkInField);
		});
	};

	if (value.target.checked) {
		confirm({
			title: `COSITAS`,
			content: (
				<List
					size='small'
					dataSource={checkInInstructions}
					renderItem={(item, index) => (
						<List.Item>
							<Text>
								{index + 1}. {item}
							</Text>
						</List.Item>
					)}
				/>
			),
			okText: 'Habilitar',
			okType: 'primary',
			cancelText: 'Cancelar',
			onOk() {
				saveTypeUserField();
			},
		});
	} else {
		confirm({
			title: `¿Se deshabilitará el checkIn por documento estás seguro?`,
			// content: 'Una vez eliminado, no lo podrá recuperar',
			okText: 'Si',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				checkInFieldsIds.map(async (checkInFieldId: string) => {
					await remove(checkInFieldId, true);
				});
			},
		});
	}
};

// Logic to create the voting coefficient
// TODO: pending copy for this instructions
const voteWeightInstructions = [
	'Se creará el campo "Coeficiente", se debe determinar su valor para cada asistente',
	'Si ya hay asistentes inscritos en el evento, se deberá actualizar la información de dicho campo.',
	'Si el campo Coeficiente queda vacío o con valor 0 se tomará de forma automática con el valor de 1',
	
];

const voteWeightFields = [
	{
		id: undefined,
		name: 'voteWeight',
		description: undefined,
		label: 'Coeficiente',
		unique: false,
		mandatory: true,
		options: undefined,
		order_weight: undefined,
		type: 'voteWeight',
		visibleByAdmin: true,
		visibleByContacts: undefined,
	},
];
const ListTypeUserFields = [
	{
		id: undefined,
		name: 'list_type_user',
		description: undefined,
		label: 'type user',
		unique: false,
		mandatory: true,
		options: [{
			label : 'tipo A',
			value : 'A'
		},
		{
			label : 'tipo B',
			value : 'B'
		},
		{
			label : 'tipo C',
			value : 'C'
		}],
		order_weight: undefined,
		type: 'list_type_user',
		visibleByAdmin: true,
		visibleByContacts: undefined,
	},
];

export const createFieldForAssembly = async ({
	value,
	checkInByAssemblyFields,
	save,
	remove,
}: {
	value: CheckboxChangeEvent;
	checkInByAssemblyFields: string[];
	save: Function;
	remove: Function;
}) => {
	const saveFieldForAssembly = async () => {
		voteWeightFields.map(async voteWeightField => {
			await save(voteWeightField);
		});
	};

	if (value.target.checked) {
		confirm({
			title: `Al habilitar el modo asamblea, recuerda que:`,
			content: (
				<List
					size='small'
					dataSource={voteWeightInstructions}
					renderItem={(item, index) => (
						<List.Item>
							<Text>
								{index + 1}. {item}
							</Text>
						</List.Item>
					)}
				/>
			),
			okText: 'Habilitar',
			okType: 'primary',
			cancelText: 'Cancelar',
			onOk: async () => {
				await saveFieldForAssembly();
				window.location.reload()
			},
		});
	} else {
		confirm({
			title: `¿Está seguro que desea deshabilitar el modo asamblea?`,
			// content: 'Una vez eliminado, no lo podrá recuperar',
			okText: 'Si, deshabilitar',
			okType: 'danger',
			cancelText: 'No, cancelar',
			onOk: async () => {
				checkInByAssemblyFields.map(async (checkInFieldId: string) => {
					await remove(checkInFieldId, true);
					window.location.reload()
				});
			},
		});
	}
};
