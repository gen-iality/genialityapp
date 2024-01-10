import { Col, Row, Tag, Typography } from 'antd';
import React from 'react';
import { IDateVersion } from './typings/interfaces';

const DateAndVersion = (props: IDateVersion) => {
	const { termsVersion, termsLastUpdate } = props;
	return (
		<Row gutter={[8, 0]} justify='start'>
			<Col>
				<Typography.Text type='secondary'>
					Version: <Tag>{termsVersion}</Tag>
				</Typography.Text>
			</Col>
			<Col>
				<Typography.Text type='secondary'>
					Actualizado el: <Tag>{termsLastUpdate}</Tag>
				</Typography.Text>
			</Col>
		</Row>
	);
};

export default DateAndVersion;
