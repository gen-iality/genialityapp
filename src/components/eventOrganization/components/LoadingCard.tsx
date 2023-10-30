import { Col, Skeleton } from 'antd';
import React from 'react';

const LoadingCard = () => {
	return (
		<Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
			<Skeleton.Image style={{ width: '280px', height: '177px' }} />
			<Skeleton active />
		</Col>
	);
};

export default LoadingCard;
