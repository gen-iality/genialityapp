import { AgendaApi, EventsApi } from '@/helpers/request';
import { Form, Select } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
	eventId: string;
	initialState: string | null;
}

const { Option } = Select;

export default function ActivityRedirectForm(props: Props) {
	const [activities, setActivities] = useState<Array<Activity>>([]);
	const [redirectActivity, setRedirectActivity] = useState<string | null>(null);
	useEffect(() => {
		console.log('initialState', props.initialState);
		if (!!props.initialState) {
			setRedirectActivity(props.initialState);
		}
		if (!activities.length) {
			AgendaApi.byEvent(props.eventId).then(res => {
				console.log(res);
				setActivities(res.data);
			});
		}
	}, []);

	const handleChangeSelect = async (activityId: string) => {
		setRedirectActivity(activityId);
		await EventsApi.editOne({ redirect_activity: activityId }, props.eventId);
	};

	return (
		<Form.Item
			label={
				<label style={{ marginTop: '2%' }}>
					Redirigir a una actividad <label style={{ color: 'red' }}>*</label>
				</label>
			}
			rules={[{ required: true, message: 'El nombre es requerido' }]}>
			<Select value={redirectActivity} onChange={handleChangeSelect}>
				<Option value={null}>{'No redireccionar'}</Option>
				{!!activities.length &&
					activities.map(activity => (
						<Option key={activity._id} value={activity?._id}>
							{activity?.name}
						</Option>
					))}
			</Select>
		</Form.Item>
	);
}

export interface Activity {
	_id: string;
	name: string;
	subtitle: null;
	image: null;
	description: null;
	capacity: number;
	event_id: string;
	datetime_end: Date;
	datetime_start: Date;
	date_start_zoom: Date;
	date_end_zoom: Date;
	updated_at: Date;
	created_at: Date;
	access_restriction_types_available: null;
	activity_categories: any[];
	space: null;
	hosts: any[];
	type: null;
	access_restriction_roles: any[];
}
