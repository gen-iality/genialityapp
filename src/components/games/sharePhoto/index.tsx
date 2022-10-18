import Header from '@/antdComponents/Header';
import { Form } from 'antd';
import * as React from 'react';
// import CreateSharePhoto from './components/CreateSharePhoto';

interface Props {
	eventId: string;
}

export default function SharePhoto(props: Props) {
	const { eventId } = props;
	return (
		<Form>
			<Header
				title={'Dinamica Comparte tu Foto 📷'}
				description={''}
				back
				save={true}
				saveMethod={() => console.log('Saving')}
				// remove={() => console.log('Remove SharePhoto')}
			/>
			{/* <CreateSharePhoto /> */}
		</Form>
	);
}
