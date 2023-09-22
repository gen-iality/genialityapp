import { Actions, EventFieldsApi, OrganizationPlantillaApi } from '../../../helpers/request';
import DatosModal from './modal';
import { Tabs, Table, Checkbox, Button, Row, Col, Tooltip, Modal } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	DragOutlined,
	SaveOutlined,
	PlusCircleOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
// @ts-ignore
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { ColumnsType } from 'antd/lib/table';
import { createFieldForAssembly, createFieldForCheckInPerDocument, createTypeUserFild } from './utils';
import { DispatchMessageService } from '../../../context/MessageService';
import { Field, State } from './types';
import { firestore } from '../../../helpers/firebase';
import { GetTokenUserFirebase } from '../../../helpers/HelperAuth';
import { useEffect, useState, Fragment } from 'react';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import arrayMove from 'array-move';
import CMS from '../../newComponent/CMS';
import Header from '../../../antdComponents/Header';
import ModalCreateTemplate from '../../shared/modalCreateTemplate';
const { confirm } = Modal;
const { TabPane } = Tabs;
const DragHandle = sortableHandle(() => <DragOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableContainer = sortableContainer((props: any) => <tbody {...props} />);
const SortableItem = sortableElement((props: any) => <tr {...props} />);

export default function Datos(props: any) {
	const { eventIsActive } = useHelper();
	const [state, setState] = useState<State>({
		modal: false,
		available: false,
		info: {},
		newField: false,
		loading: true,
		deleteModal: false,
		edit: false,
		fields: [],
		properties: null,
		value: '',
		visibleModal: false,
		isEditTemplate: { status: false, datafields: [], template: null },
		checkInExists: false,
		checkInByUserType : false,
		checkInByUserTypeFields : [],
		checkInFieldsIds: [],
		checkInByAssembly: false,
		checkInByAssemblyFields: [],
		user_properties: [],
	});
	const eventId = props.eventId;
	const html = document.querySelector('html');
	const organization = props.sendprops ? props.sendprops?.org : props.org;

	useEffect(() => {
		fetchFields();
	}, []);

	const updateTable = (fields: any) => {
		let fieldsorder = orderFieldsByWeight(fields);
		fieldsorder = updateIndex(fieldsorder);
		setState(prev => ({ ...prev, isEditTemplate: { ...prev.isEditTemplate, datafields: fieldsorder } }));
	};

	const orderFieldsByWeight = (extraFields: any) => {
		extraFields = extraFields.sort((a: any, b: any) =>
			(a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
				? -1
				: 1
		);
		return extraFields;
	};

	const fetchFields = async () => {
		try {
			const organizationId = organization?._id;
			let fields: any[] = [];
			let fieldsReplace: any[] = [];
			let checkInFieldsIds: any[] = [];
			let checkInByUserTypeFields: any[] = [];
			const checkInByAssemblyFields: any[] = [];
			if ((organizationId && !eventId && props.edittemplate) || (organizationId && !eventId && !props.edittemplate)) {
				fields = await props.getFields();
				//Realizado con la finalidad de no mostrar la contraseña ni el avatar
				//Comentado la parte de password y contrasena para dejar habilitado solo en el administrador
				fields.map((field: any) => {
					if (field.name !== 'avatar') {
						fieldsReplace.push(field);
					}
				});
				fields = orderFieldsByWeight(fieldsReplace);
				fields = updateIndex(fieldsReplace);
			} else if (!props.edittemplate) {
				setState(prev => ({ ...prev, checkInExists: false, checkInFieldsIds: [] }));
				setState(prev => ({ ...prev, checkInByAssembly: false, checkInByAssemblyFields: [] }));
				fields = await EventFieldsApi.getAll(props.eventId);
				//Realizado con la finalidad de no mostrar la contraseña ni el avatar
				//Comentado la parte de password y contrasena para dejar habilitado solo en el administrador
				console.log('fields',fields);
				
				fields.map((field: any) => {
					if (field.name !== 'avatar') {
						fieldsReplace.push(field);
					}
					if (
						field.type === 'checkInField' ||
						field.name === 'birthdate' ||
						field.name === 'bloodtype' ||
						field.name === 'gender'
					) {
						checkInFieldsIds.push(field._id);
						setState(prev => ({ ...prev, checkInExists: true, checkInFieldsIds: checkInFieldsIds }));
					}
					if (field.type === 'voteWeight') {
						checkInByAssemblyFields.push(field._id);
						setState(prev => ({
							...prev,
							checkInByAssembly: true,
							checkInByAssemblyFields,
						}));
					}
					if (field.type === 'list_type_user') checkInByUserTypeFields.push(field._id)
				});
				fields = orderFieldsByWeight(fieldsReplace);
				fields = updateIndex(fieldsReplace);
			}
			setState(prev => ({ ...prev, fields, loading: false ,checkInByUserType : checkInByUserTypeFields.length > 0 ,checkInByUserTypeFields }));
		} catch (e) {
			showError(e);
		}
	};

	const updateIndex = (fields: any) => {
		for (var i = 0; i < fields.length; i++) {
			fields[i].index = i;
			fields[i].order_weight = i + 1;
		}
		return fields;
	};

	const addField = () => {
		setState(prev => ({ ...prev, edit: false, modal: true }));
	};

	//Guardar campo en el evento
	const saveField = async (field: Field, isEdit?: boolean) => {
		DispatchMessageService({
			type: 'loading',
			key: 'loading',
			msj: ' Por favor espere mientras se guarda la información...',
			action: 'show',
		});
		try {
      // @ts-ignore
			let totaluser: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
			const organizationId = organization?._id;
			if (organizationId) {
				if (state.edit || !!isEdit) {
					// @ts-ignore
					await props.editField(field._id || field.id, field, state.isEditTemplate, updateTable);
				} else {
					await props.createNewField(field, state.isEditTemplate, updateTable);
				}
			} else {
				if (state.edit || !!isEdit) {
					// @ts-ignore
					await EventFieldsApi.editOne(field, field._id || field.id, eventId);
				} else {
					await EventFieldsApi.createOne(field, eventId);
				}
				totaluser = await firestore.collection(`${eventId}_event_attendees`).get();
			}
			if (totaluser?.docs?.length > 0 && field?.name == 'pesovoto') {
				firestore
					.collection(`${eventId}_event_attendees`)
					.get()
					.then(resp => {
						if (resp.docs.length > 0) {
							resp.docs.map(doc => {
								var datos = doc.data();
								var objectP = datos.properties;
								var properties = objectP;
								objectP = { ...objectP, pesovoto: properties && properties.pesovoto ? properties.pesovoto : 1 };
								datos.properties = objectP;
								firestore
									.collection(`${eventId}_event_attendees`)
									.doc(doc.id)
									.set(datos);
							});
						}
					});
			}
			await fetchFields();
			setState(prev => ({ ...prev, modal: false, edit: false, newField: false }));
			DispatchMessageService({
				key: 'loading',
				action: 'destroy',
			});
			DispatchMessageService({
				type: 'success',
				msj: 'Información guardada correctamente!',
				action: 'show',
			});
		} catch (e: any) {
			showError(e.response.data.message || e.response.status);
			DispatchMessageService({
				key: 'loading',
				action: 'destroy',
			});
			DispatchMessageService({
				type: 'error',
				msj: e.response.data.message || e.response.status,
				action: 'show',
			});
		}
	};

	//Funcion para guardar el orden de los datos
	const submitOrder = async () => {
		DispatchMessageService({
			type: 'loading',
			key: 'loading',
			msj: ' Por favor espere mientras se guarda la información...',
			action: 'show',
		});
		const organizationId = organization?._id;
		try {
			if (organizationId && !eventId) {
				await props.orderFields(state.properties);
			} else if (eventId && !organizationId) {
				// && props.byEvent condición que no esta llegando
				let token = await GetTokenUserFirebase();
				await Actions.put(`api/events/${props.eventId}?token=${token}`, state.properties);
			} else {
				await props.orderFields(state.isEditTemplate.datafields, state.isEditTemplate, updateTable);
			}
			DispatchMessageService({
				key: 'loading',
				action: 'destroy',
			});
			DispatchMessageService({
				type: 'success',
				msj: 'El orden de la recopilación de datos se ha guardado',
				action: 'show',
			});
		} catch (e: any) {
			DispatchMessageService({
				key: 'loading',
				action: 'destroy',
			});
			DispatchMessageService({
				type: 'error',
				msj: e,
				action: 'show',
			});
		}
		fetchFields();
	};

	//Abrir modal para editar dato
	const editField = (info: any) => {
		setState(prev => ({ ...prev, info, modal: true, edit: true }));
	};

	const closeModal2 = () => {
		setState(prev => ({ ...prev, info: {}, modal: false, edit: false }));
	};
	//Borrar dato de la lista
	const removeField = async (item: any, checkInFieldsDelete?: any) => {
		const onHandlerRemove = async () => {
			try {
				const organizationId = organization?._id;
				if (organizationId) {
					await props.deleteField(item, state.isEditTemplate, updateTable);
				} else {
					await EventFieldsApi.deleteOne(item, eventId);
				}
				DispatchMessageService({
					key: 'loading',
					action: 'destroy',
				});
				DispatchMessageService({
					type: 'success',
					msj: 'Se eliminó la información correctamente!',
					action: 'show',
				});
				await fetchFields();
			} catch (e: any) {
				DispatchMessageService({
					key: 'loading',
					action: 'destroy',
				});
				DispatchMessageService({
					type: 'error',
					msj: `No ha sido posible eliminar el campo error: ${e?.response?.data?.message || e.response?.status}`,
					action: 'show',
				});
			}
		};

		if (checkInFieldsDelete) {
			onHandlerRemove();
			return;
		}

		DispatchMessageService({
			type: 'loading',
			key: 'loading',
			msj: ' Por favor espere mientras se borra la información...',
			action: 'show',
		});
		confirm({
			title: `¿Está seguro de eliminar la información?`,
			icon: <ExclamationCircleOutlined />,
			content: 'Una vez eliminado, no lo podrá recuperar',
			okText: 'Borrar',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				onHandlerRemove();
			},
		});
	};

	const closeDelete = () => {
		setState(prev => ({ ...prev, deleteModal: false }));
	};

	const closeModal = () => {
		setState(prev => ({ ...prev, inputValue: '', modal: false, info: {}, edit: false }));
	};

	const showError = (error: any) => {
		DispatchMessageService({
			type: 'success',
			msj: props.intl.formatMessage({ id: 'toast.error', defaultMessage: 'Sry :(' }),
			action: 'show',
		});
		if (error.response) {
			const { status, data } = error.response;
			if (status === 401) setState(prev => ({ ...prev, timeout: true, loader: false }));
			else setState(prev => ({ ...prev, serverError: true, loader: false, errorData: data }));
		} else {
			let errorData = error.message;
			if (error.request) {
				errorData = error.request;
			}
			errorData.status = 708;
			setState(prev => ({ ...prev, serverError: true, loader: false, errorData }));
		}
	};

	const changeCheckBoxEffect = async (field: Field, key: keyof typeof field, key2: keyof typeof field | null = null) => {
		
		try {
			// This logic is for select just visible for contacts or visible for admin
			let fieldCopy = { ...field };
			// @ts-ignore
			fieldCopy[key] = !fieldCopy[key];
			if (key2 != null) {
				// @ts-ignore
				fieldCopy[key2] = fieldCopy[key2] == true ? false : fieldCopy[key2];
			}
			// This logic is for select just visible for contacts or visible for admin
			saveField(fieldCopy, true).then(resp => {
				DispatchMessageService({
					key: 'loading',
					action: 'destroy',
				});
				DispatchMessageService({
					type: 'success',
					msj: 'Se ha editado correctamente el campo!',
					action: 'show',
				});
			});
		} catch (error) {
			DispatchMessageService({
				key: 'loading',
				action: 'destroy',
			});
			DispatchMessageService({
				type: 'error',
				msj: 'El Campo no ha sido posible actualizarlo, intenta mas tarde',
				action: 'show',
			});
		}
	};

	const changeCheckBox = async (field: Field, key: any, key2: any = null) => {
		setState(prev => ({ ...prev, edit: true }));
		await changeCheckBoxEffect(field, key, key2);
	};
	//Contenedor draggable
	const DraggableContainer = (props: any) => (
		<SortableContainer useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />
	);
	//Función para hacer que el row sea draggable
	const DraggableBodyRow = ({ className, style, ...restProps }: any) => {
		const fields =
			state.fields.length > 0
				? state.fields
				: state.isEditTemplate?.datafields.length > 0
				? state.isEditTemplate?.datafields
				: [];
		// function findIndex base on Table rowKey props and should always be a right array index
		const index = fields.findIndex((x: any) => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	//Función que se ejecuta cuando se termina de hacer drag
	const onSortEnd = ({ oldIndex, newIndex }: any) => {
		let user_properties = state.user_properties;
		/* console.log('FIELDSSTATE==>', this.state.fields); */
		const fields: Field[] =
			state.fields.length > 0
				? state.fields
				: state.isEditTemplate?.datafields?.length > 0
				? state.isEditTemplate?.datafields
				: [];

		if (oldIndex !== newIndex) {
			let newData: Field[] = arrayMove(([] as Field[]).concat(fields), oldIndex, newIndex).filter(el => !!el);
			newData = updateIndex(newData);
			user_properties = newData;
			setState(prev => ({
				...prev,
				fields: newData,
				user_properties,
				isEditTemplate: { ...prev.isEditTemplate, datafields: newData },
				available: false,
				properties: { user_properties: user_properties },
			}));
		}
	};

	const onChange1 = async (e: any, plantId: any) => {
		
		setState(prev => ({ ...prev, value: '' }));
		await OrganizationPlantillaApi.putOne(props.eventId, plantId);
	};

	const handlevisibleModal = () => {
		setState(prev => ({ ...prev, visibleModal: !state.visibleModal }));
	};


	const columns: ColumnsType<Field> = [
		{
			title: '',
			dataIndex: 'sort',
			width: 30,
			className: 'drag-visible',
			render: () => <DragHandle />,
		},
		{
			title: 'Dato',
			dataIndex: 'label',
			width: 180,
			ellipsis: true,
			sorter: (a: any, b: any) => a.label.localeCompare(b.label),
		},
		{
			title: 'Tipo de dato',
			dataIndex: 'type',
			ellipsis: true,
			width: 120,
			sorter: (a: any, b: any) => a.type.localeCompare(b.type),
		},
		{
			title: 'Obligatorio',
			dataIndex: 'mandatory',
			align: 'center',
			render: (record: any, key: any) =>
				key.name !== 'email' && key.name !== 'names' ? (
					<Checkbox
						name='mandatory'
						onChange={() => changeCheckBox(key, 'mandatory')}
						checked={record}
						disabled={key.type === 'checkInField' || key.type === 'voteWeight' || key.name === 'list_type_user'}
					/>
				) : (
					<Checkbox checked />
				),
		},
		{
			title: 'Visible solo contactos',
			dataIndex: 'visibleByContacts',
			align: 'center',
			render: (record: any, key: any) => (
				<Checkbox
					name='visibleByContacts'
					onChange={() => changeCheckBox(key, 'visibleByContacts', 'visibleByAdmin')}
					checked={record}
					disabled={
						key.type === 'checkInField' || key.name === 'birthdate' || key.name === 'bloodtype' || key.name === 'gender' 
					}
				/>
			),
		},
		{
			title: 'Sensible (Networking)',
			dataIndex: 'sensibility',
			align: 'center',
			render: (record: any, key: any) => (
				<Checkbox
					name='sensibility'
					onChange={() => changeCheckBox(key, 'sensibility')}
					checked={record}
					disabled={
						key.type === 'checkInField' || key.name === 'birthdate' || key.name === 'bloodtype' || key.name === 'gender'
					}
				/>
			),
		},
		{
			title: 'Visible solo admin',
			dataIndex: 'visibleByAdmin',
			align: 'center',
			render: (record: any, key: any) =>
				key.name !== 'email' && key.name !== 'names' ? (
					<Checkbox
						name='visibleByAdmin'
						onChange={() => changeCheckBox(key, 'visibleByAdmin', 'visibleByContacts')}
						checked={record}
					/>
				) : (
					<Checkbox checked />
				),
		},
		{
			title: 'Opciones',
			dataIndex: '',
			render: (key: any) => {
				// const { eventIsActive } = useHelper();

				return (
					<Row wrap gutter={[8, 8]}>
						<Col>
							{key.name !== 'email' && (
								<Tooltip placement='topLeft' title='Editar'>
									<Button
										key={`editAction${key.index}`}
										id={`editAction${key.index}`}
										onClick={() => editField(key)}
										icon={<EditOutlined />}
										type='primary'
										size='small'
										disabled={!eventIsActive && window.location.toString().includes('eventadmin')}
									/>
								</Tooltip>
							)}
						</Col>
						<Col>
							{key.name !== 'email' && key.name !== 'names' && (
								<Tooltip placement='topLeft' title='Eliminar'>
									<Button
										key={`removeAction${key.index}`}
										id={`removeAction${key.index}`}
										onClick={() => removeField(key._id || key.name)}
										icon={<DeleteOutlined />}
										danger
										size='small'
										disabled={!eventIsActive && window.location.toString().includes('eventadmin')}
									/>
								</Tooltip>
							)}
						</Col>
					</Row>
				);
			},
		},
	];

	const colsPlant = [
		{
			title: 'Nombre',
			dataIndex: 'name',
			ellipsis: true,
			sorter: (a: any, b: any) => a.name.localeCompare(b.name),
		},
	];

	return (
		<div>
			<Tabs defaultActiveKey='1'>
				{state.visibleModal && (
					<ModalCreateTemplate
						visible={state.visibleModal}
						handlevisibleModal={handlevisibleModal}
						organizationid={props.eventId}
					/>
				)}

				{props.type !== 'organization' && (
					<TabPane tab='Configuración General' key='1'>
						<Fragment>
							<Header title={'Recopilación de datos'} />
							<small>
								{`Configure los datos que desea recolectar de los asistentes ${
									organization ? 'de la organización' : 'del evento'
								}`}
							</small>

							<Table
								columns={columns}
								dataSource={state.fields}
								pagination={false}
								rowKey='index'
								size='small'
								components={{
									body: {
										wrapper: DraggableContainer,
										row: DraggableBodyRow,
									},
								}}
								title={() => (
									<Row justify='end' wrap gutter={[8, 8]}>
										<Col>
											<Checkbox
												name='checkInByUserType'
												onChange={value =>
													createTypeUserFild({
														value,
														checkInFieldsIds: state.checkInByUserTypeFields,
														save: saveField,
														remove: removeField,
													})
												}
												checked={state.checkInByUserType}>
												Tipo de usuario
											</Checkbox>
										</Col>
										<Col>
											<Checkbox
												name='checkInByAssembly'
												onChange={value =>
													createFieldForAssembly({
														value,
														checkInByAssemblyFields: state.checkInByAssemblyFields,
														save: saveField,
														remove: removeField,
													})
												}
												checked={state.checkInByAssembly}>
												Modo asamblea
											</Checkbox>
										</Col>
										<Col>
											<Checkbox
												name='checkInByDocument'
												onChange={value =>
													createFieldForCheckInPerDocument({
														value,
														checkInFieldsIds: state.checkInFieldsIds,
														save: saveField,
														remove: removeField,
													})
												}
												checked={state.checkInExists}>
												CheckIn por documento
											</Checkbox>
										</Col>
										<Col>
											<Button disabled={state.available} onClick={submitOrder} type='primary' icon={<SaveOutlined />}>
												{'Guardar orden'}
											</Button>
										</Col>
										<Col>
											<Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={addField}>
												{'Agregar'}
											</Button>
										</Col>
									</Row>
								)}
							/>
							{state.modal && (
								<Modal
									visible={state.modal}
									title={state.edit ? 'Editar Dato' : 'Agregar Dato'}
									footer={false}
									onCancel={closeModal2}
									okText={'Guardar'}>
									<DatosModal cancel={closeModal2} edit={state.edit} info={state.info} action={saveField} />
								</Modal>
							)}
						</Fragment>
					</TabPane>
				)}
				{props.type == 'organization' && (
					<TabPane tab={props.type === 'configMembers' ? 'Configuración Miembros' : 'Plantillas'} key='3'>
						{state.isEditTemplate.status || props.type === 'configMembers' ? (
							<Fragment>
								<Header
									title={
										<div>
											Recopilación de datos de plantillas
											{props.type !== 'configMembers' && (
												<Button
													type='link'
													style={{ color: 'blue' }}
													onClick={() =>
														setState(prev => ({
															...prev,
															isEditTemplate: { ...state.isEditTemplate, status: false, datafields: [] },
														}))
													}>
													Volver a plantillas
												</Button>
											)}
										</div>
									}
								/>
								<small>
									{`Configure los datos que desea recolectar de los asistentes ${
										organization ? 'de la organización' : 'del evento'
									}`}
								</small>

								<Table
									columns={columns}
									dataSource={props.type === 'configMembers' ? state.fields : state.isEditTemplate.datafields}
									pagination={false}
									rowKey='index'
									size='small'
									components={{
										body: {
											wrapper: DraggableContainer,
											row: DraggableBodyRow,
										},
									}}
									title={() => (
										<Row justify='end' wrap gutter={[8, 8]}>
											<Col>
												<Button disabled={state.available} onClick={submitOrder} type='primary' icon={<SaveOutlined />}>
													{'Guardar orden'}
												</Button>
											</Col>
											<Col>
												<Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={addField}>
													{'Agregar'}
												</Button>
											</Col>
										</Row>
									)}
								/>
								{state.modal && (
									<Modal
										visible={state.modal}
										title={state.edit ? 'Editar Dato' : 'Agregar Dato'}
										footer={false}
										onCancel={closeModal2}
										cancelText={'Cancelar'}>
										<DatosModal cancel={closeModal2} edit={state.edit} info={state.info} action={saveField} />
									</Modal>
								)}
							</Fragment>
						) : (
							<CMS
								API={OrganizationPlantillaApi}
								eventId={props.event?.organizer_id ? props.event?.organizer_id : props.eventId}
								title={'Plantillas de recoleccion de datos'}
								addFn={() => setState(prev => ({ ...prev, visibleModal: true }))}
								columns={colsPlant}
								editFn={(values: any) => {
									let fields = orderFieldsByWeight(values.user_properties);
									fields = updateIndex(fields);
									setState(prev => ({
										...prev,
										isEditTemplate: {
											...prev.isEditTemplate,
											status: true,
											datafields: fields,
											template: values,
										},
									}));
								}}
								pagination={false}
								actions
							/>
						)}
					</TabPane>
				)}
			</Tabs>
		</div>
	);
}
