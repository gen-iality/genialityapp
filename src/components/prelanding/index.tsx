import {
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Form,
	Input,
	message,
	Modal,
	Row,
	Space,
	Spin,
	Switch,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, OrderedListOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import { useContext, useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { SectionsPrelanding } from '@/helpers/constants';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import InformationIcon from '@2fd/ant-design-icons/lib/Information';
import { CurrentEventContext } from '@/context/eventContext';
import { EventsApi } from '@/helpers/request';
import ModalContador from './modalContador';
import { useHistory } from 'react-router';
import { obtenerData, settingsSection, visibleAlert } from './hooks/helperFunction';
import DrawerPreviewLanding from './drawerPreviewLanding';
import getEventsponsors from '../empresas/customHooks/useGetEventCompanies';
import { Agenda, Alias, DataSource, Description, EventContext, LandingBlock, Speaker, Sponsor } from './types';

const DragHandle = SortableHandle(() => (
	<DragIcon
		style={{
			cursor: 'move',
			color: '#999999',
			fontSize: '22px',
		}}
	/>
));

const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

interface PreLandingSectionsProps {
	tabActive: any;
	changeTab: any;
}

const PreLandingSections = ({ tabActive, changeTab }: PreLandingSectionsProps) => {
	const [dataSource, setDataSource] = useState<DataSource>({} as DataSource);
	const [modal, setModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);
	const [description, setDescription] = useState<Description[]>([]);
	const [speakers, setSpeakers] = useState<Speaker[]>([]);   
	const [agenda, setAgenda] = useState<Agenda[]>([]);
	const [sponsors, setSponsors] = useState<Sponsor[]>([]);

	const [drawerPreviewVisible, setDrawerPreviewVisible] = useState(false);

	

	const cEvent : EventContext = useContext(CurrentEventContext);
	const history = useHistory();
	const pathForRedirection = `/eventadmin/${cEvent.value._id}`;
	const [companies] = getEventsponsors(cEvent.value._id) as [[]];

	useEffect(() => {
		if (!cEvent.value || tabActive !== '3') return;
		setLoading(true);
		obtainPreview();
		async function obtainPreview() {
			//OBTENENOS LAS SECCIONES DE PRELANDING
			const previews = await EventsApi.getPreviews(cEvent.value._id);
			
			//SE ORDENAN LAS SECCIONES POR INDEX
			const sections = previews?._id ? previews : SectionsPrelanding;
			const { speakers, agenda, description } = await obtenerData(cEvent);

			setDescription(description);
			setSpeakers(speakers);
			setAgenda(agenda);
			setDataSource(sections);
			setLoading(false);
			// setSponsors(companies);
		}
	}, [cEvent, tabActive]);

	useEffect(() => {
		if (companies.length > 0) {
			let newCompanies = companies.map((company: any, ind: number) => {
				return { ...company, index: company.index ? company.index : ind + 1 };
			});

			newCompanies = newCompanies.sort(function(a, b) {
				return a.index - b.index;
			});
			setSponsors(newCompanies as []);
		}
	}, [companies]);

	//PERMITE ACTUALIZAR EL STATUS DE LAS SECCIONES
	const updateItem = (item: LandingBlock, val: boolean) => {
		setLoading(true);
		item.status = val;
		const newDataSource = dataSource?.main_landing_blocks?.map((data: any) => {
			if (data.key == item.key) return item;
			else return data;
		});
		setDataSource({ ...dataSource, main_landing_blocks: newDataSource });
		setLoading(false);
	};

	const validateBlockState = (block: LandingBlock) => {
		if (block.status === true && !visibleAlert(block, description, speakers, agenda, sponsors)) {
			return 'VISIBLE_BLOCK';
		} else if (block.status === true && visibleAlert(block, description, speakers, agenda, sponsors)) {
			return 'BLOCK_LOCKED';
		} else {
			return 'HIDDEN_BLOCK';
		}
	};

	const stateOrStateColor = (block: LandingBlock, iWantColor?: any) => {
		const state = validateBlockState(block);

		switch (state) {
			case 'VISIBLE_BLOCK':
				return iWantColor ? '#52C41A' : 'Visible';
			case 'BLOCK_LOCKED':
				return iWantColor ? '#FAAD14' : 'Sin contenido';
			case 'HIDDEN_BLOCK':
				return iWantColor ? '#FF4D4F' : 'Oculto';
			default:
				return iWantColor ? '#FF4D4F' : 'Oculto';
		}
	};

	const onChange = (checked: boolean) => {
		console.log(`switch to ${checked}`);
	};

	//PERMITE GUARDAR STATUS DE LAS SECCIONES EN BD
	const saveSections = async () => {
    if (dataSource) {
      // return;
      let saved = true;
      let response = undefined;
      const main_landing_blocks = dataSource.main_landing_blocks;
      try {
        if (!dataSource?._id) {
          response = await EventsApi.addPreviews(cEvent.value._id, { main_landing_blocks });
        } else {
          response = await EventsApi.updatePreviews(dataSource?._id, { main_landing_blocks });
        }
      } catch (error) {
        saved = false;
      }
      if (response) setDataSource(response);
      if (saved) message.success('Configuración guardada correctamente');
      else message.error('Error al guardar la configuración');
    } else {
      message.error('Secciones no se pueden guardar');
    }
  };

	const saveAliases = (alias : Alias) => {
		const { main_landing_blocks } = dataSource
		const newBlocks = main_landing_blocks.map((block)=>({...block, label : alias[block.key]}))		
		setDataSource({...dataSource, main_landing_blocks : newBlocks})
		setModal(false)
	}
	//COLUMNAS PARA LAS SECCIONES DE PRELANDING
	
	const columns = [
		{
			title: '',
			dataIndex: 'sort',
			width: 50,
			className: 'drag-visible',
			// @ts-ignore
			render: () => <DragHandle />, 
		},
		{
			title: <OrderedListOutlined />,
			dataIndex: 'order',
			width: 80,
			className: 'drag-visible',
			render: (val: any, item: any) => {
				return <Avatar shape='square'>{item.index + 1}</Avatar>;
			},
		},
		{
			title: 'Sección',
			dataIndex: 'name',
			className: 'drag-visible',
		},
		{
			title: 'Alias',
			dataIndex: 'label',
			className: 'drag-visible',
		},
		{
			title: 'Estado',
			dataIndex: 'status',
			render: (val: any, item: any) => {
				return <Tag color={stateOrStateColor(item, true)}>{stateOrStateColor(item)}</Tag>;
			},
		},
		{
			title: 'Opciones',
			dataIndex: 'status',
			className: 'drag-visible',
			render: (val: any, item: any) => {
				return (
					<Space>
						<Switch
							loading={loading}
							onChange={val => updateItem(item, val)}
							checkedChildren={<EyeOutlined />}
							unCheckedChildren={<EyeInvisibleOutlined />}
							checked={val}
						/>
						<Badge
							count={
								visibleAlert(item, description, speakers, agenda, sponsors) ? (
									<Tooltip title={'Debe configurar el contenido para que se visualice en la landing'}>
										<InformationIcon style={{ color: '#FAAD14', fontSize: '20px' }} />
									</Tooltip>
								) : (
									0
								)
							}>
							<Button onClick={() => settingsSection(item, cEvent, history, setVisible, changeTab)}>Configurar</Button>
						</Badge>
					</Space>
				);
			},
		},
	];

	const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
		if (oldIndex !== newIndex) {
			let newData: LandingBlock[] = arrayMove(dataSource.main_landing_blocks, oldIndex, newIndex).filter(el => !!el);

			if (newData) {
				newData = newData.map((data, key) => {
					return { ...data, index: key };
				});
			}
			setDataSource({ ...dataSource, main_landing_blocks: newData });
			// setDataSource(newData);
		}
	};

	const DraggableContainer = (props: any) => (
		// @ts-ignore
		<SortableBody useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />
	);

	const DraggableBodyRow = ({ className, style, ...restProps }: { [x: string]: any; className: any; style: any }) => {
		// function findIndex base on Table rowKey props and should always be a right array index
		const index = dataSource?.main_landing_blocks?.findIndex(x => {
			return x.index === restProps['data-row-key'];
		});
		// @ts-ignore
		return <SortableItem index={index} {...restProps} />;
	};

	return (
		<Row gutter={[8, 8]}>
			{modal && <Modal
			  visible={modal}
			  title={'Editar alias de secciones'}
			  footer={false}
			  onCancel={()=>setModal(false)}
			  okText={'Guardar'}>
			   <Form onFinish={saveAliases} layout='vertical'>
				{dataSource.main_landing_blocks.map((block)=>(
					<Form.Item
					key={block.key}
					label={block.name}
					name={`${block.key}`}
					initialValue={block.label || block.name}
					>
						<Input  name={block.name} type='text' placeholder={'Ingrese un alias'} />
				    </Form.Item>	
				))}
				<Button htmlType='submit' type='primary'>
					Guardar
				</Button>
				</Form>
			</Modal>}
			<Col span={18}>
				<Card hoverable={true} style={{ borderRadius: '20px' }} loading={loading}>
					<Table
						tableLayout='auto'
						style={{ userSelect: 'none' }}
						pagination={false}
						dataSource={dataSource.main_landing_blocks}
						columns={columns}
						rowKey='index'
						components={{
							body: {
								wrapper: DraggableContainer,
								row: DraggableBodyRow,
							},
						}}
					/>
					<Row justify='end' style={{ marginTop: 10 }}>
					<Button style={{ margin :'0px  5px'}} onClick={() => setModal(true)} type='primary'>
								Editar alias
					</Button>
						{!loading ? (
							<Button onClick={() => saveSections()} type='primary'>
								Guardar orden y estado
							</Button>
						) : (
							<Spin />
						)}
					</Row>
				</Card>
			</Col>

			<Col span={6}>
				<Card style={{ borderRadius: '20px', height: '100%' }} loading={loading}>
					<Row gutter={[4, 4]}>
						<Col span={24}>
							<Typography.Title level={5}>Opciones rápidas</Typography.Title>
						</Col>
						<Col span={24}>
							<Space direction='vertical' style={{ width: '100%' }}>
								<Button size='large' block onClick={() => history.push(`${pathForRedirection}/styles`)}>
									Estilos landing
								</Button>
								<Button size='large' block onClick={() => history.push(`${pathForRedirection}/datos`)}>
									Datos a recolectar
								</Button>
								<Button onClick={() => setDrawerPreviewVisible(true)} size='large' block>
									Vista previa landing
								</Button>
							</Space>
						</Col>
						{/* <Col span={24}>
							<Typography.Title level={5}>Redirigir a actividad</Typography.Title>
						</Col>
						<Col span={24}>
							<Switch defaultChecked onChange={onChange} />
						</Col> */}
					</Row>
				</Card>
			</Col>

			{/* Modal para la creacion de la data del contador */}
			<ModalContador visible={visible} setVisible={setVisible} />
			<DrawerPreviewLanding visibleDrawer={drawerPreviewVisible} setVisibleDrawer={setDrawerPreviewVisible} />
		</Row>
	);
};

export default PreLandingSections;
