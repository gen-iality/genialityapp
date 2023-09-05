import { createElement, Fragment, useEffect, useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import ErrorServe from '../components/modal/serverError';
import UserStatusAndMenu from '../components/shared/userStatusAndMenu';
import { connect } from 'react-redux';
import * as userActions from '../redux/user/actions';
import * as eventActions from '../redux/event/actions';
import MenuOld from '../components/events/shared/menu';
import { Menu, Drawer, Button, Col, Row, Layout, Space, Grid, Dropdown, Typography, Image } from 'antd';
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	LockOutlined,
	LoadingOutlined,
	ApartmentOutlined,
	EditOutlined,
	DownOutlined,
} from '@ant-design/icons';
import withContext from '../context/withContext';
import ModalLoginHelpers from '../components/authentication/ModalLoginHelpers';
import { recordTypeForThisEvent } from '../components/events/Landing/helpers/thisRouteCanBeDisplayed';
import { FormattedMessage } from 'react-intl';
import AccountCircleIcon from '@2fd/ant-design-icons/lib/AccountCircle';
import { useIntl } from 'react-intl';
import { getCorrectColor } from '@/helpers/utils';
import { isOrganizationCETA } from '@/components/user-organization-to-event/helpers/helper';
import { Organization } from '@/components/eventOrganization/types';
import { OrganizationApi, OrganizationFuction } from '@/helpers/request';
import MenuItem from 'antd/lib/menu/MenuItem';

const { useBreakpoint } = Grid;

const { setEventData } = eventActions;
const { addLoginInformation, showMenu } = userActions;

const { Header } = Layout;
const zIndex = {
	zIndex: '2',
};
const initialDataGeneral = {
	selection: [],
	name: '',
	user: false,
	menuOpen: false,
	modal: false,
	create: false,
	valid: true,
	uid: '',
	id: '',
	serverError: false,
	showAdmin: false,
	photo: '',
	showEventMenu: false,
	tabEvtType: true,
	tabEvtCat: true,
	eventId: null,
	userEvent: null,
	modalVisible: false,
	tabModal: '1',
	anonimususer: false,
	filterOpen: false,
};

interface Props {
	showMenu: any;
	loginInfo: any;
	cHelper: any;
	cEvent: any;
	cEventUser: any;
	cUser: any;
}
const Headers = (props: Props) => {
	const { showMenu, loginInfo, cHelper, cEvent, cEventUser, cUser } = props;
	const { helperDispatch } = cHelper;
	const [headerIsLoading, setHeaderIsLoading] = useState(true);
	const [dataGeneral, setdataGeneral] = useState(initialDataGeneral);
	const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
	const [myOrganizations, setMyorganizations] = useState<any[]>([]);
	const { id: paramsId } = useParams<{ id: string }>();
	const [showButtons, setshowButtons] = useState({
		buttonregister: true,
		buttonlogin: true,
	});
	const containerBgColor = cEvent?.value?.styles?.containerBgColor || null;
	const validatorCms = window.location.pathname.includes('/eventadmin');
	const validatorOrg =
		window.location.pathname.includes('/organization') &&
		!window.location.pathname.includes('/admin') &&
		paramsId !== undefined;
	const bgcolorContainer = !validatorCms && !validatorOrg && containerBgColor ? containerBgColor : '#FFFFFF';
	const [fixed, setFixed] = useState(false);
	const screens = useBreakpoint();
	let history = useHistory();

	const organizationLogo = currentOrganization?.styles.event_image;
	const organizationName = currentOrganization?.name;
	// TODO: Here there is an error
	const intl = useIntl();
	const organizationMenu = (
		<Menu>
			<Menu.Item icon={<EditOutlined />}>
				<Link to={`/admin/organization/${paramsId}`}>
					<Button type='text'>Administrar</Button>
				</Link>
			</Menu.Item>
		</Menu>
	);
	const openMenu = () => {
		setdataGeneral({
			...dataGeneral,
			menuOpen: !dataGeneral.menuOpen,
			filterOpen: false,
		});
	};

	const handleMenuEvent = () => {
		setdataGeneral({
			...dataGeneral,
			showEventMenu: !dataGeneral.showEventMenu,
		});
		showMenu();
	};

	const showDrawer = () => {
		setdataGeneral({ ...dataGeneral, showEventMenu: true });
	};

	const onClose = () => {
		setdataGeneral({ ...dataGeneral, showEventMenu: false });
	};

	async function LoadCurrentUser() {
		let { value, status } = cUser;

		if (!value && status === 'LOADED') return setHeaderIsLoading(false), setdataGeneral(initialDataGeneral);
		if (!value) return;

		setdataGeneral((prev) => ({
			...prev,
			name: value?.names || value?.name,
			userEvent: { ...value, properties: { names: value.names || value.name } },
			photo: value?.picture
				? value?.picture
				: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
			uid: value?.user?.uid,
			id: value?.user?._id,
			user: true,
			anonimususer: value?.isAnonymous || false,
		}));
		setHeaderIsLoading(false);
		// }
	}
	const WhereHerePath = () => {
		let containtorganization = window.location.pathname.includes('/organization');
		return containtorganization ? 'organization' : 'landing';
	};

	const getOrganization = async () => {
		const orga = await OrganizationFuction.obtenerDatosOrganizacion(paramsId);
		if (orga) setCurrentOrganization(orga);
	};

	useEffect(() => {
		if (validatorOrg && paramsId) {
			getOrganization();
		}
	}, [validatorOrg, paramsId]);

	const userLogOut = (callBack: any) => {
		const params = {
			user: cUser.value,
			setCurrentUser: cUser.setCurrentUser,
			setuserEvent: cEventUser.setuserEvent,
			formatMessage: intl.formatMessage,
			handleChangeTypeModal: cHelper.handleChangeTypeModal,
			history,
		};

		helperDispatch({
			type: 'logout',
			showNotification: callBack,
			params,
		});
	};

	const isEventWithPayment = (cEvent: any) => {
		if (!cEvent) return true;

		if (cEvent?.value?.payment?.active) {
			return true;
		}
		return false;
	};

	const MenuMobile = (
		<Menu>
			<Menu.Item
				key='menu-item-menu-mobile-1'
				onClick={() => {
					helperDispatch({ type: 'showLogin', visible: true, organization: WhereHerePath() });
				}}>
				<FormattedMessage id='header.expired_signin' defaultMessage='Sign In' />
			</Menu.Item>
			{!isOrganizationCETA() && !isEventWithPayment(cEvent) && (
				<Menu.Item
					key='menu-item-menu-mobile-2'
					onClick={() => {
						helperDispatch({ type: 'showRegister', visible: true, organization: WhereHerePath() });
					}}>
					<FormattedMessage id='registration.button.create' defaultMessage='Sign Up' />
				</Menu.Item>
			)}
		</Menu>
	);

	useEffect(() => {
		LoadCurrentUser();
	}, [cUser?.value]);

	useEffect(() => {
		async function RenderButtonsForTypeEvent() {
			let typeEvent = recordTypeForThisEvent(cEvent);
			switch (typeEvent) {
				case 'PRIVATE_EVENT':
					setshowButtons({
						buttonregister: false,
						buttonlogin: true,
					});
					break;

				case 'PUBLIC_EVENT_WITH_REGISTRATION':
					setshowButtons({
						buttonregister: true,
						buttonlogin: true,
					});
					break;

				case 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS':
					setshowButtons({
						buttonregister: true,
						buttonlogin: true,
					});
					break;

				default:
					setshowButtons({
						buttonregister: true,
						buttonlogin: true,
					});
					break;
			}
		}

		if (cEvent?.value) {
			RenderButtonsForTypeEvent();
		}
	}, [cEvent]);

	useEffect(() => {
		const onScroll = (e: any) => {
			const showHeaderFixed = window.scrollY > 64;
			fixed != showHeaderFixed && setFixed(showHeaderFixed);
		};
		document.addEventListener('scroll', onScroll);
	}, [fixed]);

	const landingOrganization = () => {
		window.location.href = `${window.location.origin}/organization/${cEvent.value.organizer_id}/events`;
	};

	const isLandingOrPreLanding = (): boolean => {
		if (!window.location.href.includes('landing')) {
			return window.location.pathname.replace('/', '') === cEvent?.value?._id;
		}
		return true;
	};

	const getMyOrganizations = async () => {
		try {
			const organizations: Organization[] = await OrganizationApi.mine();
			if (organizations?.length > 0) {
				setMyorganizations(organizations.map((item) => item.id));
			}
		} catch (error) {
			console.log('[debug] organization not found');
		}
	};

	useEffect(() => {
		if (cUser.value && validatorOrg) {
			getMyOrganizations();
		} else {
			setMyorganizations([]);
		}
	}, [cUser.value, validatorOrg]);
	return (
		<Fragment>
			<Header
				style={{
					position: 'sticky',
					zIndex: 1,
					width: '100%',
					left: 0,
					top: 0,
					float: 'right',
					transition: 'all 0.5s ease-out',
					opacity: fixed ? '0.9' : '1',
					backgroundColor: bgcolorContainer,
					boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
					padding: screens.xs ? '0 20px' : '0 50px',
				}}>
				<Menu theme='light' mode='horizontal' style={{ backgroundColor: bgcolorContainer, border: 'none' }}>
					<Row justify='space-between' align='middle'>
						{isLandingOrPreLanding() && !screens.xs && cEvent.value?.organizer?.name && (
							<Button
								type='link'
								onClick={landingOrganization}
								icon={<ApartmentOutlined style={{ color: getCorrectColor(bgcolorContainer) }} />}
								size='large'>
								<Typography.Text style={{ color: getCorrectColor(bgcolorContainer) }}>
									Ver más contenido de{' '}
									<Typography.Text strong style={{ color: getCorrectColor(bgcolorContainer) }}>
										{cEvent.value?.organizer?.name}
									</Typography.Text>
								</Typography.Text>
							</Button>
						)}
						{window.location.href.includes('eventadmin') && <Typography.Text strong style={{textTransform: 'uppercase'}}>{cEvent.value?.name && 'Evento - ' + cEvent.value?.name}</Typography.Text>}
						{validatorOrg && (
							<Space align='center'>
								<Image
									width={100}
									height={60}
									preview={false}
									src={organizationLogo}
									fallback='http://via.placeholder.com/500/F5F5F7/CCCCCC?text=No%20Image'
									style={{
										borderRadius: '5px',
										objectFit: 'cover',
										border: '4px solid #FFFFFF',
										//boxShadow: '2px 2px 10px 1px rgba(0,0,0,0.25)',
										backgroundColor: '#FFFFFF;',
									}}
								/>
								{cUser?.value && myOrganizations.includes(paramsId) ? (
									<Dropdown overlay={organizationMenu} trigger={['click']}>
										<Typography.Title style={{ cursor: 'pointer' }} level={5}>
											{`${!screens.xs ? 'Bienvenidos a ' : ''}  ${organizationName}`} <DownOutlined />
										</Typography.Title>
									</Dropdown>
								) : (
									<Typography.Title level={5}>{`${
										!screens.xs ? 'Bienvenidos a ' : ''
									}  ${organizationName}`}</Typography.Title>
								)}
							</Space>
						)}

						<Row className='logo-header' justify='space-between' align='middle'>
							{/* Menú de administrar un evento (esto debería aparecer en un evento no en todo lado) */}
							{dataGeneral?.showAdmin && (
								<Col span={2} offset={3} data-target='navbarBasicExample'>
									<span className='icon icon-menu' onClick={() => handleMenuEvent()}>
										<Button style={zIndex} onClick={() => showDrawer()}>
											{createElement(dataGeneral.showEventMenu ? MenuUnfoldOutlined : MenuFoldOutlined, {
												className: 'trigger',
												onClick: () => {
													console.log('CERRAR');
												},
											})}
										</Button>
									</span>
								</Col>
							)}
						</Row>

						{headerIsLoading ? (
							<LoadingOutlined
								style={{
									fontSize: '30px',
								}}
							/>
						) : !dataGeneral.userEvent ? (
							screens.xs ? (
								<div style={{ position: 'absolute', right: 15, top: 6 }}>
									<Space>
										<Dropdown overlay={MenuMobile}>
											<Button
												style={{
													backgroundColor: '#3681E3',
													color: '#FFFFFF',
													border: 'none',
												}}
												size='large'
												shape='circle'
												icon={<AccountCircleIcon style={{ fontSize: '28px' }} />}
											/>
										</Dropdown>
									</Space>
								</div>
							) : (
								<Space>
									{showButtons.buttonlogin ? (
										<>
											{recordTypeForThisEvent(cEvent) !== 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS' && (
												<Button
													icon={<LockOutlined />}
													style={{
														backdropFilter: 'blur(8px)',
														background: '#FFFFFF99',
														color: getCorrectColor(bgcolorContainer),
													}}
													size='large'
													onClick={() => {
														helperDispatch({ type: 'showLogin', visible: true, organization: WhereHerePath() });
													}}>
													{intl.formatMessage({
														id: 'modal.title.login',
														defaultMessage: 'Iniciar sesión',
													})}
												</Button>
											)}
										</>
									) : (
										<Space>
											<Dropdown overlay={MenuMobile}>
												<Button
													style={{
														backgroundColor: '#3681E3',
														color: '#FFFFFF',
														border: 'none',
													}}
													size='large'
													shape='circle'
													icon={<AccountCircleIcon style={{ fontSize: '28px' }} />}
												/>
											</Dropdown>
										</Space>
									)}

									{showButtons.buttonregister && !isOrganizationCETA() && !isEventWithPayment(cEvent) && (
										<Button
											style={{
												backdropFilter: 'blur(8px)',
												background: '#FFFFFF99',
												color: getCorrectColor(bgcolorContainer),
											}}
											size='large'
											onClick={() => {
												helperDispatch({ type: 'showRegister', visible: true, organization: WhereHerePath() });
											}}>
											{intl.formatMessage({
												id: 'modal.title.register',
												defaultMessage: 'Registrarme',
											})}
										</Button>
									)}
								</Space>
							)
						) : dataGeneral.userEvent != null && !dataGeneral.anonimususer ? (
							<div style={screens.xs ? { position: 'absolute', right: 20, top: 0 } : undefined}>
								<UserStatusAndMenu
									user={dataGeneral.user}
									menuOpen={dataGeneral.menuOpen}
									colorHeader={bgcolorContainer}
									photo={
										dataGeneral.photo
											? dataGeneral.photo
											: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
									}
									name={dataGeneral.name ? dataGeneral.name : ''}
									userEvent={dataGeneral.userEvent}
									eventId={dataGeneral.eventId}
									logout={(callBack: any) => userLogOut(callBack)}
									openMenu={() => openMenu()}
									loginInfo={loginInfo}
								/>
							</div>
						) : (
							dataGeneral.userEvent != null &&
							dataGeneral.anonimususer && (
								<UserStatusAndMenu
									user={dataGeneral.user}
									menuOpen={dataGeneral.menuOpen}
									colorHeader={bgcolorContainer}
									photo={'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
									name={cUser.value?.names}
									userEvent={dataGeneral.userEvent}
									eventId={dataGeneral.eventId}
									logout={(callBack: any) => userLogOut(callBack)}
									openMenu={() => console.log('openMenu')}
									loginInfo={loginInfo}
									anonimususer={true}
								/>
							)
						)}

						{<ModalLoginHelpers organization={1} />}
					</Row>
				</Menu>
			</Header>

			{/* Menu mobile */}

			{dataGeneral.showAdmin && dataGeneral.showEventMenu && (
				<div id='navbarBasicExample'>
					<Drawer
						className='hiddenMenuMobile_Landing'
						title='Administrar evento'
						maskClosable={true}
						bodyStyle={{ padding: '0px' }}
						placement='left'
						closable={true}
						onClose={() => onClose()}
						visible={dataGeneral.showEventMenu}>
						<MenuOld match={window.location.pathname} />
					</Drawer>
				</div>
			)}

			{dataGeneral.serverError && <ErrorServe errorData={dataGeneral.serverError} />}
		</Fragment>
	);
};

const mapStateToProps = (state: any) => ({
	categories: state.categories.items,
	types: state.types.items,
	loginInfo: state.user.data,
	eventMenu: state.user.menu,
	permissions: state.permissions,
	error: state.categories.error,
	event: state.event.data,
	modalVisible: state.stage.modal,
});

const mapDispatchToProps = {
	setEventData,
	addLoginInformation,
	showMenu,
};

let HeaderWithContext = withContext(Headers);
export default connect(mapStateToProps, mapDispatchToProps)(HeaderWithContext);
