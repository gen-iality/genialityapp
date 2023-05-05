import { CurrentEventContext } from '@/context/eventContext';
import { CurrentEventUserContext } from '@/context/eventUserContext';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { CurrentUserContext } from '@/context/userContext';
import { SectionsPrelanding } from '@/helpers/constants';
import { AgendaApi, EventsApi, SpeakersApi } from '@/helpers/request';
import { ArrowUpOutlined } from '@ant-design/icons';
import { Col, Row, Layout, Card, Grid, BackTop, Avatar } from 'antd';
/** ant design */

import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import ModalPermission from '../authentication/ModalPermission';
import { RenderSectios } from '../events/Description/componets/renderSectios';
import InfoEvent from '../shared/infoEvent';
import ActivityBlock from './block/activityBlock';
import CountdownBlock from './block/countdownBlock';
import SpeakersBlock from './block/speakersBlock';
import SponsorBlock from './block/sponsorBlock';
import { obtenerConfigActivity } from './hooks/helperFunction';
import MenuScrollBlock from './MenuScrollBlock';
import getEventsponsors from '../empresas/customHooks/useGetEventCompanies';
import useScript from './hooks/useScript';
import useInjectScript from './hooks/useInjectScript';
import { scriptGoogleTagManagerAudi, scriptTeadesAudi, scriptTeadeBodyAudi } from './constants/constants';
import { PropsPreLanding } from './types/Prelanding';
import { Agenda, ApiGeneric, DataSource, Description, Speaker, Sponsor } from './types';
import { style } from './constants'
const { Content } = Layout;
const { useBreakpoint } = Grid;

const ViewPrelanding = ({ preview } : PropsPreLanding) => {
	const mobilePreview = preview ? preview : 'desktop';
	const screens = useBreakpoint();

	//CONTEXTOS
	const cEventContext = useContext(CurrentEventContext);
	const cUser = useContext(CurrentUserContext);
	const cEventUser = useContext(CurrentEventUserContext);
	const { setIsPrelanding } = useHelper();
	const [companies] = getEventsponsors(cEventContext?.value?._id);

	//History
	const history = useHistory();

	//ESTADOS
	const [sections, setSections] = useState<DataSource>();

	// PERMITE VALIDAR SI EXISTE DESCRIPCION
	const [description, setDescription] = useState<Description[]>([]);
	//PERMITE VALIDAR SI EXISTE CONFERENCISTAS
	const [speakers, setSpeakers] = useState<Speaker[]>([]);
	//PERMITE VALIDAR SI EXISTEN ACTIVIDADES
	const [agenda, setAgenda] = useState<Agenda[]>([]);
	//PERMITE VALIDAR SI EXISTEN SPONSORS
	const [sponsors, setSponsors] = useState<Sponsor[]>([]);


	const cBanner = cEventContext.value?.styles?.banner_image;
	const cFooter = cEventContext.value?.styles?.banner_footer;
	const cContainerBgColor = cEventContext.value?.styles?.containerBgColor;
	const cBackgroundImage = cEventContext.value?.styles?.BackgroundImage;
	const bgColor = cEventContext.value?.styles?.toolbarDefaultBg;
	const textColor = cEventContext.value?.styles?.textMenu;

	//Validacion temporal para el evento audi
	const idEvent = cEventContext.value?._id;
	const shadow = idEvent !== '6334782dc19fe2710a0b8753' ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : '';

	//PERMITE INGRESAR A LA LANDING DEL EVENTO
	useEffect(() => {
		setIsPrelanding(true);
		if (!cEventContext.value) return;
		//SE REMUEVE LA SESION EN EL EVENTO OBLIGANDO A UNIR AL USUARIO
		if (window.sessionStorage.getItem('session') !== cEventContext.value?._id) {
			window.sessionStorage.removeItem('session');
		}
		if (preview) return;
		if (window.sessionStorage.getItem('session') === cEventContext.value?._id) {
			if (!!cEventContext?.value?.redirect_activity && typeof cEventContext?.value?.redirect_activity === 'string') {
				history.replace(`/landing/${cEventContext.value?._id}/activity/${cEventContext?.value?.redirect_activity}`);
			} else {
				history.replace(`/landing/${cEventContext?.value?._id}`);
			}
		}
		
	}, [cEventContext, cUser, cEventUser]);

	//! TEMPORAL VALIDATION TO GET INTO EVENT FOR LG EVENT
	useEffect(() => {
		if (cEventContext?.value?.redirect_landing) {
			if (cEventUser?.value?._id && history.location.pathname === `/${idEvent}`) {
				window.sessionStorage.setItem('session', cEventContext.value?._id);
				return history.push(`/landing/${cEventContext?.value?._id}`);
			} else {
				console.log('Is LG EVENT but Event User not exists... Stay here');
			}
		}
	}, [cEventUser]);
	//! TEMPORAL VALIDATION TO GET INTO EVENT FOR LG EVENT

	/**DYNAMIC STYLES */
	// Estilos para el contenido del bloque en desktop y mobile
	const desktopBlockContentStyle : React.CSSProperties = {
		padding: idEvent !== '6334782dc19fe2710a0b8753' ? '40px' : '0px',
	};


	/// Script

	useInjectScript(scriptGoogleTagManagerAudi, idEvent, false);
	useInjectScript(scriptTeadesAudi, idEvent, false);
	useInjectScript(scriptTeadeBodyAudi, idEvent, true);
	useScript('https://p.teads.tv/teads-fellow.js', idEvent);
	// Funciones para el render
	const obtenerOrder = ( name: string ) => {
		if (sections) {
			return sections.main_landing_blocks?.filter(section => section.name == name)[0]?.index + 2;
		} else {
			return 2;
		}
	};

	const visibleSection = ( name: string ) => {
		return sections && sections.main_landing_blocks?.filter(section => section.name == name && section.status).length > 0
	};

	const isVisibleCardSections = () => {
		return sections && sections.main_landing_blocks?.filter(section => section.status).length > 1 
	};
	useEffect(() => {
		if (!cEventContext.value) return;

		obtainPreview();
		async function obtainPreview() {
			//OBTENENOS LAS SECCIONES DE PRELANDING
			const previews = await EventsApi.getPreviews(cEventContext.value._id);
			//SE ORDENAN LAS SECCIONES POR INDEX
			const sections = previews?._id ? previews : SectionsPrelanding;
            
			setSections(sections);
		}
	}, [cEventContext]);
	//OBTENER  DATA DEL EVENTO PARA VALIDACIONES
	useEffect(() => {
		if (!cEventContext.value) return;
		obtenerData();
		async function obtenerData() {
			const sectionsDescription : ApiGeneric<Description> | undefined = await EventsApi.getSectionsDescriptions(cEventContext?.value._id);
			let speakers : Speaker[] | undefined = await SpeakersApi.byEvent(cEventContext?.value._id);
			const agenda : ApiGeneric<Agenda> = await AgendaApi.byEvent(cEventContext?.value._id);
			const speakersFiltered = speakers?.filter((speaker: any) => speaker.published || speaker.published == 'undefined');
			const agendaConfig : Agenda[] | undefined = await obtenerConfigActivity(cEventContext.value?._id, agenda.data);
			const agendaFiltered = agendaConfig?.filter(
				agendaCfg => agendaCfg.isPublished || agendaCfg.isPublished == undefined
			);
          
            
			setDescription(sectionsDescription?.data || []);
			setSpeakers(speakersFiltered || []);
			setAgenda(agendaFiltered || []);
		}
	}, [cEventContext.value]);

	useEffect(() => {
		setSponsors(companies as Sponsor[] || []);
	}, [companies]);

	return (
		<Layout>
			{(cEventContext.value?.styles?.show_banner === undefined ||
				cEventContext.value?.styles?.show_banner === 'true') && (
				<Row className='headerContainer'>
					<Col span={24}>
						<img src={cBanner}></img>
					</Col>
				</Row>
			)}
			<Content
				style={{
					backgroundColor: cContainerBgColor,
					backgroundImage: `url(${cBackgroundImage})`,
					backgroundAttachment: 'fixed',
				}}>
				{/**MODAL INSCRIPCION EN EL EVENTO*/}
				<ModalPermission />
				<Row
					gutter={[0, 16]}
					style={screens.xs || mobilePreview === 'smartphone' ? style.mobileBlockContainerStyle : style.desktopBlockContainerStyle}>
					<Col id='Franja de titulo' span={24}>
						<Row>
							<Col span={24}>
								<InfoEvent paddingOff={true} preview={preview} />
							</Col>
						</Row>
					</Col>
					<Col id='Bloques del evento' span={24}>
						<Row gutter={[0, 16]} align='stretch' justify='center'>
							<Col span={24} order={1}>
								{isVisibleCardSections()
									? shadow && (
											<Card
												bodyStyle={{ padding: screens.xs ? '10px' : '24px' }}
												style={{
													boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
													borderRadius: '10px',
													color: textColor,
													backgroundColor: bgColor,
													border: 'none',
												}}>
												<Row justify='center' align='middle'>
													<MenuScrollBlock
														sections={sections && sections?.main_landing_blocks}
														vdescription={description}
														vspeakers={speakers}
														vactividades={agenda}
														vpatrocinadores={sponsors}
													/>
												</Row>
											</Card>
									  )
									: null}
							</Col>
							{visibleSection('Contador') && (
								<Col order={obtenerOrder('Contador')} span={24}>
									<Card
										id='Contador_block'
										style={{
											boxShadow: shadow,
											height: 'auto',
											borderRadius: '20px',
											color: textColor,
											backgroundColor: bgColor,
											border: 'none',
										}}>
										<CountdownBlock />
									</Card> 
								</Col>
							)}
							{visibleSection('Descripción') && description?.length > 0 && (
								<Col order={obtenerOrder('Descripción')} span={24}>
									<Card
										id='Descripción_block'
										className='viewReactQuill'
										bodyStyle={
											screens.xs || mobilePreview === 'smartphone' ? style.mobileBlockContentStyle : desktopBlockContentStyle
										}
										style={{
											boxShadow: shadow,
											borderRadius: '20px',
											backgroundColor: bgColor,
											border: 'none',
										}}>
										<RenderSectios />
									</Card>
								</Col>
							)}
							{visibleSection('Conferencistas') && speakers.length > 0 && (
								<Col  span={24} order={obtenerOrder('Conferencistas')}>
									<Card
										id='Conferencistas_block'
										bodyStyle={{
											height: '100%',
											padding: screens.xs || mobilePreview === 'smartphone' ? '10px' : '24px',
										}}
										style={{
											boxShadow: shadow,
											height: '450px',
											borderRadius: '20px',
											color: textColor,
											backgroundColor: bgColor,
											border: 'none',
										}}>
											<SpeakersBlock />										
									</Card>
								</Col>
							)}
							{visibleSection('Actividades') && agenda.length > 0 && (
								<Col span={24} order={obtenerOrder('Actividades')}>
									<Card
										id='Actividades_block'
										bodyStyle={{ height: '100%' }}
										style={{
											boxShadow: shadow,
											height: '100%',
											borderRadius: '20px',
											color: textColor,
											backgroundColor: bgColor,
											border: 'none',
										}}>
										<ActivityBlock preview={mobilePreview} />
									</Card>
								</Col>
							)}
							{visibleSection('Patrocinadores') && sponsors.length > 0 && (
								<Col span={24} order={obtenerOrder('Patrocinadores')}>
									<Card
										id='Patrocinadores_block'
										style={{
											boxShadow: shadow,
											height: '100%',
											borderRadius: '20px',
											color: textColor,
											backgroundColor: bgColor,
											border: 'none',
										}}>
										<SponsorBlock sponsors={sponsors} />
									</Card>
								</Col>
							)}
						</Row>
					</Col>
				</Row>
				<>
					{cFooter && (
						<div style={{ textAlign: 'center' }}>
							<img
								alt='footer'
								src={cFooter}
								style={{ width: '100%', maxWidth: '100%', maxHeight: '255px', objectFit: 'cover' }}
							/>
						</div>
					)}
				</>
			</Content>

			<BackTop>
				<Avatar
					shape='square'
					icon={<ArrowUpOutlined className='animate__animated animate__bounce animate__slower animate__infinite' />}
					size={50}
					style={{
						color: textColor,
						backgroundColor: bgColor,
						borderRadius: '8px',
						boxShadow: shadow,
						overflow: 'visible',
					}}></Avatar>
			</BackTop>
		</Layout>
	);
};

export default ViewPrelanding;