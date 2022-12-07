import { isHome } from '@/helpers/helperEvent';
import { CalendarFilled, ClockCircleFilled, EnvironmentFilled } from '@ant-design/icons';
import { Button, PageHeader, Space, Typography, Grid } from 'antd';
import Moment from 'moment';
import { UseEventContext } from '../../context/eventContext';
import EventAccessActionContainer from './eventAccessAction/EventAccessActionContainer';

const { useBreakpoint } = Grid;

const InfoEvent = ({ paddingOff, preview }) => {
	let isPreview = preview ? true : false;
	let cEvent = UseEventContext();
	let cEventValues = cEvent.value;
	const screens = useBreakpoint();

	// console.log('Soy una landing');

	const bgColor = cEventValues?.styles?.toolbarDefaultBg;
	const textColor = cEventValues?.styles?.textMenu;
	//Validacion temporal para el evento audi
	const idEvent = cEventValues?._id;

	return (
		<PageHeader
			style={{
				paddingLeft: paddingOff ? '' : '30px',
				paddingRight: paddingOff ? '' : '30px',
				paddingTop: '10px',
				paddingBottom: '20px',
				margin: paddingOff ? '' : '20px',
				borderRadius: '20px',
				backgroundColor: bgColor,
			}}
			title={
				<Typography.Title level={screens.xs ? 4 : 2} style={{ color: textColor, whiteSpace: 'normal' }}>
					{cEventValues?.name}
				</Typography.Title>
			}
			extra={
				isHome() && (
					<>
						{!isPreview ? (
							<EventAccessActionContainer />
						) : (
							<Button style={{ color: textColor, backgroundColor: bgColor }} type='primary' size='large'>
								Incribirme al evento
							</Button>
						)}
					</>
				)
			}
			footer={
				<Space direction='vertical' size={4} style={{ color: textColor, fontSize: '16px' }}>
					<Space wrap size={'large'}>
						<Space wrap>
							<Space>
								<CalendarFilled />
								<time>{Moment(cEventValues?.datetime_from).format('ll')}</time>
							</Space>
							<Space>
								<ClockCircleFilled />
								<time>{Moment(cEventValues?.datetime_from).format('LT')}</time>
							</Space>
						</Space>
						{idEvent !== '6334782dc19fe2710a0b8753' && (
							<Space wrap>
								<Space>
									<CalendarFilled />
									<time>{Moment(cEventValues?.datetime_to).format('ll')}</time>
								</Space>
								<Space>
									<ClockCircleFilled />
									<time>{Moment(cEventValues?.datetime_to).format('LT')}</time>
								</Space>
							</Space>
						)}
					</Space>
					{cEventValues?.type_event !== 'onlineEvent' && (
						<Space>
							<EnvironmentFilled />
							<Space wrap split={screens.xs ? null : '/'}>
								<Typography.Text style={{ color: textColor }}>{cEventValues?.address}</Typography.Text>
								<Typography.Text style={{ color: textColor }} italic>
									{cEventValues?.venue}
								</Typography.Text>
							</Space>
						</Space>
					)}
				</Space>
			}></PageHeader>
	);
};

export default InfoEvent;
