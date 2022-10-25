import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Card, Form, Input, Switch, Typography } from 'antd';
import { useState } from 'react';

interface Props {
	initialState: string;
}

export default function TematicInput(props: Props) {
	const { initialState } = props;
	return (
		<Card
			title='Tematica'
			bodyStyle={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}}>
			<Form.Item
				// style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
				// label={<label>Tematica</label>}
				initialValue={initialState}
				name='tematic'>
				<Input.TextArea
					rows={6}
					value={`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid iste ipsam expedita magni suscipit sapiente
					voluptates, recusandae omnis, totam alias quibusdam, reprehenderit porro dolores officiis? Cupiditate
					deleniti, sapiente doloremque ratione doloribus obcaecati quos aperiam fugiat consectetur ea! Qui laboriosam
					beatae sunt in blanditiis, saepe voluptas consequatur ipsam, nisi, ab repudiandae?`}
				/>
				<div></div>
			</Form.Item>
		</Card>
	);
}
